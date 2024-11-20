import { FreshContext } from "fresh";
// @ts-types="npm:@types/oauth2-server"
import OAuth2Server from "oauth2-server";

import * as clientRepository from "./repositories/clients.ts";
import * as tokenRepository from "./repositories/tokens.ts";
import * as userRepository from "./repositories/users.ts";
import * as authCodeRepository from "./repositories/authCodes.ts";

import type { SessionState } from "./session.ts";
import { STATUS_CODE } from "@std/http";
import { parseMediaType } from "@std/media-types";

async function getRequest(ctx: FreshContext) {
  const query = Object.fromEntries(ctx.url.searchParams.entries());
  const method = ctx.req.method;
  const headers = new Headers(ctx.req.headers);

  let body: unknown;
  const content = headers.get("content-type");
  if (content) {
    const [mediaType] = parseMediaType(content);
    switch (mediaType) {
      case "application/json":
        body = await ctx.req.json();
        break;
      case "multipart/form-data":
        body = await ctx.req.formData();
        break;
      case "application/x-www-form-urlencoded":
        // Correct content-type
        body = ctx.req.body;
        break;
      default:
        throw new Error("not supported media type");
    }

    headers.set(
      "content-type",
      "application/x-www-form-urlencoded",
    );
  }

  return new OAuth2Server.Request({
    headers: Object.fromEntries(headers.entries()),
    method,
    query,
    body,
  });
}

function toResponse({ body, ...res }: OAuth2Server.Response) {
  return Response.json(body, res);
}

const getAuthServer = <T extends SessionState>(
  options: OAuth2Server.ServerOptions,
) => {
  const server = new OAuth2Server(options);
  return {
    async token(
      ctx: FreshContext<T>,
      options?: OAuth2Server.TokenOptions,
    ) {
      try {
        const req = await getRequest(ctx);
        const res = new OAuth2Server.Response();
        await server.token(req, res, options);
        return toResponse(res);
      } catch (e) {
        if (
          (e as Error).message ===
            "not supported media type"
        ) {
          return Response.json(e, {
            status: STATUS_CODE.NotAcceptable,
          });
        }
        console.error(e);
        return Response.json(e, {
          status: STATUS_CODE.InternalServerError,
        });
      }
    },

    async authorize(
      ctx: FreshContext<T>,
      options?: OAuth2Server.AuthorizeOptions,
    ) {
      const req = await getRequest(ctx);
      const res = new OAuth2Server.Response();
      await server.authorize(req, res, {
        authenticateHandler: {
          handle: () => ({ user: { id: 1 } }),
        },
        ...options,
      });
      return toResponse(res);
    },

    async authenticate(
      ctx: FreshContext<T>,
      options?: OAuth2Server.AuthenticateOptions,
    ) {
      const req = await getRequest(ctx);
      const res = new OAuth2Server.Response();
      const token = await server.authenticate(req, res, options);

      if (res.status !== STATUS_CODE.OK) {
        return toResponse(res);
      }
      ctx.state.session = { auth: true, userId: token.userId };
      return ctx.next();
    },
  };
};

export const authServer = getAuthServer({
  allowEmptyState: true,
  model: {
    getClient: function (
      clientId: string,
      _clientSecret: string | null,
    ) {
      // query db for details with client
      return clientRepository.getByIdentifier(clientId);
    },
    saveAuthorizationCode: async (
      code: OAuth2Server.AuthorizationCode,
      _client: OAuth2Server.Client,
      _user: OAuth2Server.User,
    ) => {
      /* This is where you store the access code data into the database */

      await authCodeRepository.persist(code);

      return code;
    },
    saveToken: async (
      token: OAuth2Server.Token,
      client: OAuth2Server.Client,
      user: OAuth2Server.User,
    ) => {
      await tokenRepository.persist(token, client, user);

      return token;
    },
    getAuthorizationCode: async (authorizationCode: string) => {
      /* this is where we fetch the stored data from the code */
      const authCode = await authCodeRepository.getByIdentifier(
        authorizationCode,
      );

      const client = await clientRepository.getByIdentifier(
        authCode.clientId,
      );
      const user = await userRepository.getUserByCredentials(
        authCode.userId.toString(),
      );

      return {
        authorizationCode: authCode.code,
        expiresAt: authCode.expiresAt,
        redirectUri: authCode.redirectUri!,
        client,
        user: user!,
      };
    },
    revokeAuthorizationCode: async (
      authorizationCode: OAuth2Server.AuthorizationCode,
    ) => {
      /* This is where we delete codes */

      const authCode = await authCodeRepository.getByIdentifier(
        authorizationCode.authorizationCode,
      );

      if (!authCode) return false;

      await authCodeRepository.revoke(authCode.code);

      return true;
    },

    getAccessToken: async (accessToken: string) => {
      const token = await tokenRepository.getByBearerToken(accessToken);

      if (!token) {
        return null;
      }

      const client = await clientRepository.getByIdentifier(
        token.clientId,
      );
      const user = await userRepository.getUserByCredentials(
        token.userId!.toString(),
      );

      return {
        ...token,
        refreshToken: token.refreshToken ?? undefined,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt ?? undefined,
        client,
        user: user!,
      };
    },
    getRefreshToken: async (refreshToken: string) => {
      /* Retrieves the token from the database */

      const token = await tokenRepository.getByRefreshToken(refreshToken);

      if (!token) return null;

      const client = await clientRepository.getByIdentifier(
        token.clientId,
      );

      const user = await userRepository.getUserByCredentials(
        token.userId!.toString(),
      );

      return {
        refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt ?? undefined,
        client,
        user: user!,
      };
    },
    revokeToken: async (token: { refreshToken?: string }) => {
      /* Delete the token from the database */

      if (!token.refreshToken) {
        return false;
      }

      const existingToken = await tokenRepository.getByRefreshToken(
        token.refreshToken,
      );

      if (!existingToken) {
        return false;
      }

      await tokenRepository.revoke(existingToken.accessToken);

      return true;
    },

    verifyScope: (_token: unknown, _scope: unknown) => {
      /* This is where we check to make sure the client has access to this scope */

      const userHasAccess = true; // return true if this user / client combo has access to this resource
      return new Promise<boolean>((resolve) => resolve(userHasAccess));
    },
  },
});
