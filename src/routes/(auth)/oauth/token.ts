import { authServer } from "../../../auth/server.ts";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
  POST: authServer.token,
});
