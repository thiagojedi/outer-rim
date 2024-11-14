import { eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { tokens } from "../../db/models.ts";
import {
  OAuthClient,
  OAuthScope,
  OAuthToken,
  OAuthUser,
} from "@jmondi/oauth2-server";
import { generateRandomId } from "../../db/utils.ts";

import dayjs from "dayjs";
import { getByIdentifier } from "./clients.ts";

export function issueToken(
  client: OAuthClient,
  scopes: OAuthScope[],
  user?: OAuthUser,
) {
  return Promise.resolve(
    {
      accessToken: generateRandomId(),
      accessTokenExpiresAt: dayjs().add(1, "day").toDate(),
      refreshToken: null,
      refreshTokenExpiresAt: null,
      client,
      clientId: client.id,
      user: user,
      userId: user?.id ?? null,
      scopes,
    },
  );
}

export const persist = async (
  { accessTokenExpiresAt, refreshTokenExpiresAt, client, user, ...token }:
    OAuthToken,
  driver = db,
) => {
  await driver.insert(tokens).values({
    ...token,
    accessTokenExpiresAt: dayjs(accessTokenExpiresAt).toISOString(),
    refreshTokenExpiresAt: refreshTokenExpiresAt &&
      dayjs(refreshTokenExpiresAt).toISOString(),
    clientId: client.id,
    userId: user && Number(user.id),
  });
};

export const revoke = async (token: OAuthToken, driver = db) => {
  await driver.update(tokens).set({
    accessTokenExpiresAt: dayjs().toISOString(),
    refreshTokenExpiresAt: dayjs().toISOString(),
  }).where(eq(tokens.accessToken, token.accessToken));
};

export const isRefreshTokenRevoked = (token: OAuthToken) =>
  Promise.resolve(
    token.refreshTokenExpiresAt
      ? dayjs(token.refreshTokenExpiresAt).isBefore(dayjs())
      : true,
  );

export const issueRefreshToken = async (
  token: OAuthToken,
  _client: OAuthClient,
  driver = db,
) => {
  token.refreshToken = generateRandomId();
  token.refreshTokenExpiresAt = dayjs().add(1, "week").toDate();
  await driver.update(tokens).set({
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt?.toISOString(),
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
    accessTokenExpiresAt: dayjs(token.accessTokenExpiresAt).toDate(),
    refreshTokenExpiresAt: token.refreshTokenExpiresAt
      ? dayjs(token.refreshTokenExpiresAt).toDate()
      : null,
    client,
    scopes: client.scopes,
    originatingAuthCodeId: token.originatingAuthCodeId ?? undefined,
  };
};
