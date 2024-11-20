import { eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { tokens } from "../../db/models.ts";
import * as OAuth2Server from "npm:@types/oauth2-server@3.0.18";

export const persist = async (
  token: OAuth2Server.Token,
  client: OAuth2Server.Client,
  user: OAuth2Server.User,
  driver = db,
) => {
  await driver.insert(tokens).values({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt!,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    clientId: client.id,
    userId: user.id,
  });
};

export const revoke = async (accessToken: string, driver = db) => {
  await driver.update(tokens).set({
    accessTokenExpiresAt: new Date(),
    refreshTokenExpiresAt: new Date(),
  }).where(eq(tokens.accessToken, accessToken));
};

export const getByBearerToken = (accessToken: string, driver = db) =>
  driver.query.tokens.findFirst({
    where: (tokens, { eq }) => eq(tokens.accessToken, accessToken),
  });

export const getByRefreshToken = (
  refreshToken: string,
  driver = db,
) => (driver.query.tokens.findFirst({
  where: (tokens, { eq }) =>
    eq(
      tokens.refreshToken,
      refreshToken,
    ),
}));
