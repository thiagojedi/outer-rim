import { STATUS_CODE } from "@std/http";
import { FreshContext, page } from "fresh";

import { define } from "../../utils.ts";
import { getUserByUsername } from "../../auth/repositories/users.ts";

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

    const user = await getUserByUsername(email, password);

    if (!user) {
      return page({ error: true }, { status: STATUS_CODE.Unauthorized });
    }

    ctx.state.session = { auth: true, userId: user.id };

    return authSuccess(ctx);
  },
});

export default function SignInPage({ error }: { error: boolean }) {
  return (
    <main>
      <form method="post">
        <input type="email" name="email" value="" />
        <input type="password" name="password" value="" />
        <button type="submit">Sign in</button>
      </form>
      {error && <p>Error on login</p>}
    </main>
  );
}
