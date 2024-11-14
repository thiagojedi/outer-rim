import { STATUS_CODE } from "@std/http";
import { define } from "../../utils.ts";

export const handler = define.middleware((ctx) => {
  if (ctx.state.session.auth) {
    return ctx.next();
  }
  return new Response(
    null,
    {
      status: STATUS_CODE.TemporaryRedirect,
      headers: {
        location: `/login?${new URLSearchParams({
          redirect: ctx.url.pathname + ctx.url.search,
        })}`,
      },
    },
  );
});
