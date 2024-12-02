import { define } from "../../../../../utils.ts";
import { authServer } from "../../../../../auth/server.ts";

export const handler = define.middleware([
  authServer.authenticate,
]);
