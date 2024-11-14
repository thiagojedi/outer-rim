import { STATUS_CODE } from "@std/http";
import { define } from "../utils.ts";

export const handler = define.handlers((ctx) => {
  ctx.state.session.auth = false;

  return new Response(null, {
    status: STATUS_CODE.Found,
    headers: { Location: "/" },
  });
});
