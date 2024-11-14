import { FreshContext } from "fresh";
import { deleteCookie, getCookies, setCookie } from "@std/http/cookie";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";

dayjs.extend(duration);

export type SessionState = { session: { auth: boolean; userId: number } };

export const sessionMiddleware =
  ({ cookieName = "station" }: { cookieName?: string } = {}) =>
  async (
    ctx: FreshContext<SessionState>,
  ) => {
    const cookies = getCookies(ctx.req.headers);

    // TODO Hash this
    const sessionCookie = cookies.station
      ? JSON.parse(decodeURIComponent(cookies[cookieName]))
      : { auth: false, userId: -1 };
    ctx.state.session = { ...sessionCookie };

    const response = await ctx.next();

    if (ctx.state.session.auth !== sessionCookie.auth) {
      if (ctx.state.session.auth) {
        setCookie(response.headers, {
          name: cookieName,
          // TODO Hash this
          value: encodeURIComponent(
            JSON.stringify(ctx.state.session),
          ),
          maxAge: dayjs.duration({ minutes: 5 }).asSeconds(),
          sameSite: "Lax", // this is important to prevent CSRF attacks
          domain: ctx.url.hostname,
          path: "/",
          secure: false,
        });
      } else {
        deleteCookie(response.headers, cookieName);
      }
    }

    return response;
  };
