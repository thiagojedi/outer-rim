import { STATUS_CODE } from "@std/http";
import { FreshContext, page } from "fresh";
import { eq } from "drizzle-orm";

import { define } from "../../utils.ts";
import { getUserByUsernameOrEmail } from "../../auth/repositories/users.ts";
import { db } from "../../db/client.ts";
import { actors } from "../../db/models.ts";

/**
 * Redirects users back to required page if exists
 * @param context the request context
 */
const authSuccess = (context: FreshContext) => {
  const redirect = context.url.searchParams.get("redirect");
  return context.redirect(redirect ?? "/settings");
};

const getProfiles = (ctx: FreshContext) => {
  const isRedirect = ctx.url.searchParams.get("redirect");

  if (isRedirect === null) {
    return [];
  }

  return db
    .select({ handle: actors.handle, id: actors.id })
    .from(actors)
    .where(eq(actors.userId, 1));
};

export const handler = define.handlers({
  async GET(ctx) {
    if (ctx.state.session.auth) {
      return authSuccess(ctx);
    }

    const accounts = await getProfiles(ctx);

    return page({ accounts, error: false });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      const accounts = await getProfiles(ctx);

      return page({ error: true, accounts }, {
        status: STATUS_CODE.BadRequest,
      });
    }

    const user = await getUserByUsernameOrEmail(email, password);

    if (!user) {
      const accounts = await getProfiles(ctx);

      return page({ accounts, error: true }, {
        status: STATUS_CODE.Unauthorized,
      });
    }

    ctx.state.session = { auth: true, userId: user.id };

    return authSuccess(ctx);
  },
});

const SignInPage = define.page<typeof handler>(
  ({ data: { error, accounts } }) => {
    return (
      <main className="container is-max-tablet">
        <form method="POST">
          <div className="field">
            <label htmlFor="email" className="label">E-mail</label>
            <div className="control">
              <input
                required
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
                required
                name="password"
                className={`input + ${error ? "is-danger" : ""}`}
                type="password"
              />
            </div>
          </div>

          {accounts.length > 0 && (
            <div className="field">
              <label htmlFor="profile" className="label">Profile</label>
              <div className="control ">
                <div className="select">
                  <select required name="profile" id="profile">
                    <option value="">Select a profile</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.handle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="field">
            <div className="control">
              <input
                type="submit"
                className="button is-primary"
                value="Login"
              />
            </div>
          </div>
        </form>
        {error && <p>Error on login</p>}
      </main>
    );
  },
);

export default SignInPage;
