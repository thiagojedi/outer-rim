import { STATUS_CODE } from "@std/http";
import { getOAuthServer } from "../../../../../auth/server.ts";
import { getAppInfo } from "../../../../../auth/repositories/clients.ts";
import { define } from "../../../../../utils.ts";

export const handler = define.handlers({
  GET: async ({ req, ...ctx }) => {
    const authentication = await getOAuthServer(req, ctx).authenticate();

    if (authentication.status !== STATUS_CODE.OK) {
      return authentication;
    }

    const body = await authentication.json();
    const appInfo = await getAppInfo(body.client.client_id);
    return Response.json(appInfo);
  },
});
