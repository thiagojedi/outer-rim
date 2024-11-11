import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { getOAuthServer } from "../../../../../auth/server.ts";
import { getAppInfo } from "../../../../../auth/repositories/clients.ts";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const authentication = await getOAuthServer(req, ctx).authenticate();

    if (authentication.status !== STATUS_CODE.OK) {
      return authentication;
    }

    const body = await authentication.json();
    const appInfo = await getAppInfo(body.client.client_id);
    return Response.json(appInfo);
  },
};
