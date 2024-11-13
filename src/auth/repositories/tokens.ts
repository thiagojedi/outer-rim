import { db } from "../../db/client.ts";
import { tokens } from "../../db/models.ts";

export const saveToken = (
  token: {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken?: string | null;
    refreshTokenExpiresAt?: Date | null;
  },
  clientId: number,
  userId: number,
  driver = db,
) =>
  driver.insert(tokens).values({
    ...token,
    accessTokenExpiresAt: token.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: token.refreshTokenExpiresAt?.toISOString(),
    clientId,
    userId,
  }).returning().then((r) => r.at(0));

export const getToken = (token: string, driver = db) =>
  driver.query.tokens.findFirst({
    columns: {
      clientId: false,
      userId: false,
    },
    with: {
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
      client: true,
    },
    where: (tokens, { eq }) => eq(tokens.accessToken, token),
  });
