import { define } from "../utils.ts";
import { db } from "../db/client.ts";
import { setCookie, STATUS_CODE } from "@std/http";
import { page } from "fresh";

export const handler = define.handlers({
  GET(ctx) {
    if (ctx.state.session.auth) {
      const redirect = ctx.url.searchParams.get("redirect");
      // Redirect users to settings page.
      return new Response(null, {
        status: STATUS_CODE.Found,
        headers: { Location: redirect ?? "/settings" },
      });
    }
    return page();
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    // Check if the user exists in the database and the password is correct...
    // Let's assume that the type of the user data is { id: number; name: string; }.
    const user = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(
          eq(users.username, email!),
          eq(users.password, password!),
        ),
    });

    const url = ctx.url;
    if (!user) {
      return page({ error: true });
    }

    ctx.state.session = { auth: true, userId: user.id };

    const headers = new Headers();
    setCookie(headers, {
      name: "station",
      value: encodeURIComponent(
        JSON.stringify({ auth: true, userId: user.id }),
      ), // this should be a unique value for each session
      maxAge: 120,
      sameSite: "Lax", // this is important to prevent CSRF attacks
      domain: url.hostname,
      path: "/",
      secure: false,
    });
    const redirect = url.searchParams.get("redirect");
    headers.set("Location", redirect ?? "/settings");

    // Redirect users to settings page.
    return new Response(null, { status: STATUS_CODE.Found, headers });
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
