import { FreshContext } from "fresh";

import { AuthorizationServer } from "@jmondi/oauth2-server";
import {
  requestFromVanilla,
  responseToVanilla,
} from "@jmondi/oauth2-server/vanilla";

import * as clientRepository from "./repositories/clients.ts";
import * as tokenRepository from "./repositories/tokens.ts";
import * as scopeRepository from "./repositories/scopes.ts";
import * as userRepository from "./repositories/users.ts";
import * as authCodeRepository from "./repositories/authCodes.ts";

const server = new AuthorizationServer(
  clientRepository,
  tokenRepository,
  scopeRepository,
  "very-secret-key",
  {
    requiresPKCE: false,
  },
);
server.enableGrantType({
  grant: "authorization_code",
  userRepository,
  authCodeRepository,
});

const getAuthServer = <T>() => {
  return {
    token: async (ctx: FreshContext<T>) => {
      try {
        const req_1 = await requestFromVanilla(ctx.req);
        const oauthResponse = await server.respondToAccessTokenRequest(
          req_1,
        );
        return responseToVanilla(oauthResponse);
      } catch (e) {
        return Response.json(e, { status: 400 });
      }
    },

    authorize: async (ctx: FreshContext<T>) => {
      const req = await requestFromVanilla(ctx.req);
      const authRequest = await server.validateAuthorizationRequest(
        req,
      );

      authRequest.user = { id: 1 };
      authRequest.isAuthorizationApproved = true;

      const oauthResponse = await server.completeAuthorizationRequest(
        authRequest,
      );

      return responseToVanilla(oauthResponse);
    },
  };
};

export const authServer = getAuthServer();
