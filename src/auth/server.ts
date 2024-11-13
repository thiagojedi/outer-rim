import crypto from "node:crypto";
// @ts-types="npm:@types/oauth2-server"
import OAuth2Server from "oauth2-server";
import { getAppClientUris } from "./repositories/clients.ts";
import { getToken, saveToken } from "./repositories/tokens.ts";
import { FreshContext } from "fresh";
import { STATUS_CODE } from "@std/http";
import { parseMediaType } from "jsr:@std/media-types";

const log = console.log;

const mock = { // Here is a fast overview of what your db model should look like
  authorizationCode: {
    authorizationCode: "", // A string that contains the code
    expiresAt: new Date(), // A date when the code expires
    redirectUri: "", // A string of where to redirect to with this code
    client: null as unknown as OAuth2Server.Client, // See the client section
    user: null as unknown as OAuth2Server.User, // Whatever you want... This is where you can be flexible with the protocol
  },
  client: { // Application wanting to authenticate with this server
    clientId: "", // Unique string representing the client
    clientSecret: "", // Secret of the client; Can be null
    grants: [] as string[], // Array of grants that the client can use (ie, `authorization_code`)
    redirectUris: [] as string[], // Array of urls the client is allowed to redirect to
  },
  token: {
    accessToken: "", // Access token that the server created
    accessTokenExpiresAt: new Date(), // Date the token expires
    refreshTokenExpiresAt: new Date(),
    refreshToken: "",
    client: null as unknown as OAuth2Server.Client, // Client associated with this token
    user: null as unknown as OAuth2Server.User, // User associated with this token
  },
};

const model = {
  getClient: async function (clientId: string, clientSecret: string | null) {
    // query db for details with client
    log({
      title: "Get Client",
      parameters: [
        { name: "clientId", value: clientId },
        { name: "clientSecret", value: clientSecret },
      ],
    });

    const client = await getAppClientUris(clientId, clientSecret);

    const uris = client.map((uri) => uri.redirect_uris!);

    return client.length && {
      id: client.at(0)!.id.toString(),
      clientId: clientId,
      clientSecret: clientSecret!,
      grants: ["authorization_code", "refresh_token"],
      redirectUris: uris,
    };
  },
  // generateAccessToken: (client, user, scope) => { // generates access tokens
  //   log({
  //     title: 'Generate Access Token',
  //     parameters: [
  //       {name: 'client', value: client},
  //       {name: 'user', value: user},
  //     ],
  //   })
  //
  // },
  saveToken: async (
    token: typeof mock.token,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ) => {
    /* This is where you insert the token into the database */
    log({
      title: "Save Token",
      parameters: [
        { name: "token", value: token },
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });

    const savedToken = await saveToken(
      token as Required<typeof token>,
      client.clientId,
      user.user.id,
    );

    const accessTokenExpiresAt = new Date(
      Date.parse(savedToken!.accessTokenExpiresAt),
    );
    const refreshTokenExpiresAt = savedToken?.refreshTokenExpiresAt
      ? new Date(Date.parse(savedToken.refreshTokenExpiresAt))
      : undefined;

    return savedToken && {
      ...savedToken,
      refreshToken: savedToken.refreshToken ?? undefined,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      client,
      user,
    };
  },
  getAccessToken: async (accessToken: string) => {
    /* This is where you select the token from the database where the code matches */
    log({
      title: "Get Access Token",
      parameters: [
        { name: "token", value: accessToken },
      ],
    });
    const response = await getToken(accessToken);

    if (!response) {
      return false;
    }

    const { auth_tokens: token, users: user, applications: client } = response;

    return {
      ...token,
      refreshToken: token.refreshToken ?? undefined,
      accessTokenExpiresAt: new Date(
        Date.parse(token.accessTokenExpiresAt),
      ),
      refreshTokenExpiresAt: token.refreshTokenExpiresAt
        ? new Date(Date.parse(token.refreshTokenExpiresAt))
        : undefined,
      client: {
        ...client!,
        id: client!.id.toString(),
        grants: ["authorization_code", "refresh_token"],
      },
      user: user!,
    };
  },
  getRefreshToken: (token: unknown) => {
    /* Retrieves the token from the database */
    log({
      title: "Get Refresh Token",
      parameters: [
        { name: "token", value: token },
      ],
    });
    log({ name: "mock.token", value: mock.token });
    return new Promise((resolve) => resolve(mock.token));
  },
  revokeToken: (token: unknown) => {
    /* Delete the token from the database */
    log({
      title: "Revoke Token",
      parameters: [
        { name: "token", value: token },
      ],
    });
    if (!token || token === "undefined") return false;
    return new Promise((resolve) => resolve(true));
  },
  generateAuthorizationCode: (
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    _scope: unknown,
  ) => {
    log({
      title: "Generate Authorization Code",
      parameters: [
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });

    const seed = crypto.randomBytes(256);
    return crypto
      .createHash("sha1")
      .update(seed)
      .digest("hex");
  },
  saveAuthorizationCode: (
    code: OAuth2Server.AuthorizationCode,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ) => {
    /* This is where you store the access code data into the database */
    log({
      title: "Save Authorization Code",
      parameters: [
        { name: "code", value: code },
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });
    mock.authorizationCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      client: client,
      user: user,
      redirectUri: code.redirectUri,
    };
    return new Promise<OAuth2Server.AuthorizationCode>((resolve) =>
      resolve(Object.assign({
        redirectUri: `${code.redirectUri}`,
      }, mock.authorizationCode))
    );
  },
  getAuthorizationCode: (authorizationCode: string) => {
    /* this is where we fetch the stored data from the code */
    log({
      title: "Get Authorization code",
      parameters: [
        { name: "authorizationCode", value: authorizationCode },
      ],
    });
    return new Promise<typeof mock.authorizationCode>((resolve) => {
      resolve(mock.authorizationCode);
    });
  },
  revokeAuthorizationCode: (
    authorizationCode: OAuth2Server.AuthorizationCode,
  ) => {
    /* This is where we delete codes */
    log({
      title: "Revoke Authorization Code",
      parameters: [
        { name: "authorizationCode", value: authorizationCode },
      ],
    });
    mock.authorizationCode = { // DB Delete in this in memory example :)
      authorizationCode: "", // A string that contains the code
      expiresAt: new Date(), // A date when the code expires
      redirectUri: "", // A string of where to redirect to with this code
      client: null as unknown as OAuth2Server.Client, // See the client section
      user: null as unknown as OAuth2Server.User, // Whatever you want... This is where you can be flexible with the protocol
    };
    const codeWasFoundAndDeleted = true; // Return true if code found and deleted, false otherwise
    return new Promise<boolean>((resolve) => resolve(codeWasFoundAndDeleted));
  },
  verifyScope: (token: unknown, scope: unknown) => {
    /* This is where we check to make sure the client has access to this scope */
    log({
      title: "Verify Scope",
      parameters: [
        { name: "token", value: token },
        { name: "scope", value: scope },
      ],
    });
    const userHasAccess = true; // return true if this user / client combo has access to this resource
    return new Promise<boolean>((resolve) => resolve(userHasAccess));
  },
};

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

const getAuthServer = <T extends { token?: OAuth2Server.Token }>(
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
      ctx.state.token = token;
      return ctx.next();
    },
  };
};

export const authServer = getAuthServer({ model, allowEmptyState: true });

export type Token = OAuth2Server.Token;
