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

import type { SessionState } from "./session.ts";
import { STATUS_CODE } from "@std/http";

const oauthServer = new AuthorizationServer(
  clientRepository,
  tokenRepository,
  scopeRepository,
  "very-secret-key",
  {
    requiresPKCE: false,
  },
);
oauthServer.enableGrantType({
  grant: "authorization_code",
  userRepository,
  authCodeRepository,
});

const getOAuthServer = <
  T extends SessionState,
>() => {
  return {
    token: async (ctx: FreshContext<T>) => {
      try {
        const oauthResponse = await oauthServer
          .respondToAccessTokenRequest(
            await requestFromVanilla(ctx.req),
          );
        return responseToVanilla(oauthResponse);
      } catch (e) {
        return Response.json(e, { status: 400 });
      }
    },

    authorize: async (ctx: FreshContext<T>) => {
      const authRequest = await oauthServer.validateAuthorizationRequest(
        await requestFromVanilla(ctx.req),
      );

      if (!ctx.state.session.auth) {
        return ctx.redirect(
          `/login?${new URLSearchParams({
            redirect: ctx.url.toString(),
          })}`,
          STATUS_CODE.TemporaryRedirect,
        );
      }
      authRequest.user = { id: ctx.state.session.userId! };
      authRequest.isAuthorizationApproved = true;

      const oauthResponse = await oauthServer
        .completeAuthorizationRequest(
          authRequest,
        );

      return responseToVanilla(oauthResponse);
    },
  };
};

export const authServer = getOAuthServer();
