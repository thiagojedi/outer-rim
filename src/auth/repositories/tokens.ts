import { eq } from "drizzle-orm";
import {
  DateInterval,
  OAuthClient,
  OAuthScope,
  OAuthToken,
  OAuthUser,
} from "@jmondi/oauth2-server";

import { db } from "../../db/client.ts";
import { tokens } from "../../db/models.ts";
import { generateRandomId } from "../../db/utils.ts";

import { getByIdentifier } from "./clients.ts";

export const issueToken = (
  client: OAuthClient,
  scopes: OAuthScope[],
  user?: OAuthUser,
) =>
  Promise.resolve(
    {
      accessToken: generateRandomId(),
      accessTokenExpiresAt: new DateInterval("2h").getEndDate(),
      refreshToken: null,
      refreshTokenExpiresAt: null,
      client,
      clientId: client.id,
      user: user,
      userId: user?.id ?? null,
      scopes,
    },
  );

export const persist = async (
  { client, user, ...token }: OAuthToken,
  driver = db,
) => {
  await driver.insert(tokens).values({
    ...token,
    clientId: client.id,
    userId: user && Number(user.id),
  });
};

export const revoke = async (token: OAuthToken, driver = db) => {
  await driver.update(tokens).set({
    accessTokenExpiresAt: new Date(),
    refreshTokenExpiresAt: new Date(),
  }).where(eq(tokens.accessToken, token.accessToken));
};

export const isRefreshTokenRevoked = (token: OAuthToken) =>
  Promise.resolve(Date.now() > (token.refreshTokenExpiresAt?.getTime() ?? 0));

export const issueRefreshToken = async (
  token: OAuthToken,
  _client: OAuthClient,
  driver = db,
) => {
  token.refreshToken = generateRandomId();
  token.refreshTokenExpiresAt = new DateInterval("2h").getEndDate();
  await driver.update(tokens).set({
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
  }).where(eq(tokens.accessToken, token.accessToken));
  return token;
};

export const getByRefreshToken = async (
  refreshToken: string,
  driver = db,
): Promise<OAuthToken> => {
  const token = (await driver.query.tokens.findFirst({
    where: (tokens, { eq }) =>
      eq(
        tokens.refreshToken,
        refreshToken,
      ),
  }))!;
  const client = await getByIdentifier(token.clientId, driver);

  return {
    ...token,
    client,
    scopes: client.scopes,
    originatingAuthCodeId: token.originatingAuthCodeId ?? undefined,
  };
};
