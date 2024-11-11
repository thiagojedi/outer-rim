import { getOAuthServer } from "../../auth/server.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  POST: ({ req, ...ctx }) => getOAuthServer(req, ctx).token(),
});
