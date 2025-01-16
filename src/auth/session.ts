import { FreshContext } from "fresh";
import { deleteCookie, getCookies, setCookie } from "@std/http/cookie";

export type SessionConfig = { cookieName?: string };

export type SessionState = {
  session: { auth: true; userId: number; profileId: string } | {
    auth: false;
    userId: null;
    profileId: null;
  };
};

export const sessionMiddleware =
  ({ cookieName = "station" }: SessionConfig = {}) =>
  async (
    ctx: FreshContext<SessionState>,
  ) => {
    const cookies = getCookies(ctx.req.headers);

    const sessionCookie = cookies.station
      ? JSON.parse(atob(cookies[cookieName]))
      : { auth: false, userId: -1, profileId: "" };
    ctx.state.session = { ...sessionCookie };

    const response = await ctx.next();

    if (ctx.state.session.auth !== sessionCookie.auth) {
      if (ctx.state.session.auth) {
        setCookie(response.headers, {
          name: cookieName,
          value: btoa(JSON.stringify(ctx.state.session)),
          maxAge: Temporal.Duration.from({ minutes: 30 }).total("seconds"),
          sameSite: "Lax", // this is important to prevent CSRF attacks
          domain: ctx.url.hostname,
          path: "/",
          secure: false,
          httpOnly: true,
        });
      } else {
        deleteCookie(response.headers, cookieName);
      }
    }

    return response;
  };
