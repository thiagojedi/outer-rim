import { eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { tokens } from "../../db/models.ts";

export const persist = async (
  token: {
    accessToken: string;
    accessTokenExpiresAt?: Date;
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
  },
  client: { id: string },
  user: { id: number },
  driver = db,
) => {
  await driver.insert(tokens).values({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt!,
    refreshToken: token.refreshToken ?? null,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt ?? null,
    clientId: client.id,
    userId: Number(user.id),
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
