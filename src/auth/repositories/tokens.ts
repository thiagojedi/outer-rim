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
) => {
  console.log({ clientId, userId });

  return driver.insert(tokens).values({
    ...token,
    accessTokenExpiresAt: token.accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: token.refreshTokenExpiresAt?.toISOString(),
    clientId,
    userId,
  }).returning().then((r) => r.at(0));
};
