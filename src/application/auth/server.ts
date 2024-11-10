import OAuth2Server from "npm:oauth2-server";
import { getAppClientUris } from "./repositories/clients.ts";
import crypto from "node:crypto";

const log = console.log;

const mock = { // Here is a fast overview of what your db model should look like
  authorizationCode: {
    authorizationCode: "", // A string that contains the code
    expiresAt: new Date(), // A date when the code expires
    redirectUri: "" as string | undefined, // A string of where to redirect to with this code
    client: null as unknown, // See the client section
    user: null as unknown, // Whatever you want... This is where you can be flexible with the protocol
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
    refreshToken: "",
    refreshTokenExpiresAt: new Date(),
    client: null as unknown, // Client associated with this token
    user: null as unknown, // User associated with this token
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

    mock.client = {
      clientId: clientId,
      clientSecret: clientSecret!,
      grants: ["authorization_code", "refresh_token"],
      redirectUris: client.map((uri) => uri.redirect_uris!),
    };

    return new Promise((res) => res(mock.client));
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
  saveToken: (token: typeof mock.token, client: unknown, user: unknown) => {
    /* This is where you insert the token into the database */
    log({
      title: "Save Token",
      parameters: [
        { name: "token", value: token },
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });
    mock.token = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken, // NOTE this is only needed if you need refresh tokens down the line
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: client,
      user: user,
    };
    // mock.token = {
    //     "access_token": token.accessToken,
    //     "token_type": "Bearer",
    //     "scope": "read write follow push",
    //     "created_at": Date.now(),
    // };
    console.log("Saved token", mock.token);
    return new Promise((resolve) => resolve(mock.token));
  },
  getAccessToken: (token: unknown) => {
    /* This is where you select the token from the database where the code matches */
    log({
      title: "Get Access Token",
      parameters: [
        { name: "token", value: token },
      ],
    });
    if (!token || token === "undefined") return false;
    return new Promise((resolve) => resolve(mock.token));
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
    client: unknown,
    user: unknown,
    _scope: unknown,
  ) => {
    /*
        For this to work, you are going have to hack this a little bit:
        1. navigate to the node_modules folder
        2. find the oauth_server folder. (node_modules/express-oauth-server/node_modules/oauth2-server)
        3. open lib/handlers/authorize-handler.js
        4. Make the following change (around line 136):

        AuthorizeHandler.prototype.generateAuthorizationCode = function (client, user, scope) {
          if (this.model.generateAuthorizationCode) {
            // Replace this
            //return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope);
            // With this
            return this.model.generateAuthorizationCode(client, user, scope)
          }
          return tokenUtil.generateRandomToken();
        };
        */

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
    code: typeof mock.authorizationCode,
    client: unknown,
    user: unknown,
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
      redirectUri: undefined,
    };
    return new Promise((resolve) =>
      resolve(Object.assign({
        redirectUri: `${code.redirectUri}`,
      }, mock.authorizationCode))
    );
  },
  getAuthorizationCode: (authorizationCode: unknown) => {
    /* this is where we fetch the stored data from the code */
    log({
      title: "Get Authorization code",
      parameters: [
        { name: "authorizationCode", value: authorizationCode },
      ],
    });
    return new Promise((resolve) => {
      resolve(mock.authorizationCode);
    });
  },
  revokeAuthorizationCode: (authorizationCode: unknown) => {
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
      client: null, // See the client section
      user: null, // Whatever you want... This is where you can be flexible with the protocol
    };
    const codeWasFoundAndDeleted = true; // Return true if code found and deleted, false otherwise
    return new Promise((resolve) => resolve(codeWasFoundAndDeleted));
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
    return new Promise((resolve) => resolve(userHasAccess));
  },
};

export const oauthServer = new OAuth2Server({
  model,
  grants: ["authorization_code", "refresh_token"],
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});
