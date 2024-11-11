import { eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { applications, tokens, users } from "../../db/models.ts";

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

export const getToken = (token: string) =>
  db.select().from(tokens)
    .leftJoin(users, eq(tokens.userId, users.id))
    .leftJoin(applications, eq(tokens.clientId, applications.client_id))
    .where(eq(tokens.accessToken, token))
    .limit(1)
    .then((value) => value.at(0));
