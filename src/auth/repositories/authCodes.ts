import { eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { authCodes } from "../../db/models.ts";

export const getByIdentifier = async (
  authCodeCode: string,
  driver = db,
) => {
  const authCode = (await driver.query.authCodes.findFirst({
    where: (authCodes, { eq }) => eq(authCodes.code, authCodeCode),
  }))!;

  return {
    ...authCode,
    codeChallengeMethod: "plain",
  };
};

export const persist = async (
  authCode: {
    authorizationCode: string;
    redirectUri: string;
    expiresAt: Date;
  },
  client: { id: string },
  user: { id: number },
  driver = db,
) => {
  await driver.insert(authCodes).values({
    ...authCode,
    code: authCode.authorizationCode,
    clientId: client.id,
    userId: user.id,
  });
};

export const revoke = async (authCode: string, driver = db) => {
  await driver.update(authCodes).set({
    expiresAt: new Date(),
  }).where(eq(authCodes.code, authCode));
};
