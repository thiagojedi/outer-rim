import { authServer } from "../../auth/server.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  GET: authServer.authorize,
});
