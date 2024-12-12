import { STATUS_CODE } from "@std/http";
import { FreshContext, page } from "fresh";

import { define } from "../../utils.ts";
import { getUserByUsernameOrEmail } from "../../auth/repositories/users.ts";

/**
 * Redirects users back to required page if exists
 * @param context the request context
 */
const authSuccess = (context: FreshContext) => {
  const redirect = context.url.searchParams.get("redirect");
  return context.redirect(redirect ?? "/settings");
};

export const handler = define.handlers({
  GET(ctx) {
    if (ctx.state.session.auth) {
      return authSuccess(ctx);
    }
    return page();
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      return page({ error: true }, { status: STATUS_CODE.BadRequest });
    }

    const user = await getUserByUsernameOrEmail(email, password);

    if (!user) {
      return page({ error: true }, { status: STATUS_CODE.Unauthorized });
    }

    ctx.state.session = { auth: true, userId: user.id };

    return authSuccess(ctx);
  },
});

const SignInPage = define.page<typeof handler>(({ data }) => {
  const error = data?.error;

  return (
    <main className="container is-max-tablet">
      <form method="POST">
        <div className="field">
          <label htmlFor="email" className="label">E-mail</label>
          <div className="control">
            <input
              name="email"
              className={`input + ${error ? "is-danger" : ""}`}
              type="text"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password" className="label">Password</label>
          <div className="control">
            <input
              name="password"
              className={`input + ${error ? "is-danger" : ""}`}
              type="password"
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <input type="submit" className="button is-primary" value="Login" />
          </div>
        </div>
      </form>
      {error && <p>Error on login</p>}
    </main>
  );
});

export default SignInPage;
