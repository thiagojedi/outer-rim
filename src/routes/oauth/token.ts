import { Handlers } from "$fresh/server.ts";
import { getOAuthServer } from "../../auth/server.ts";

export const handler: Handlers = {
  POST: (req, ctx) => getOAuthServer(req, ctx).token(),
};
