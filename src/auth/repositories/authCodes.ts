import { eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { authCodes } from "../../db/models.ts";
import * as OAuth2Server from "npm:@types/oauth2-server@3.0.18";

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
  authCode: OAuth2Server.AuthorizationCode,
  driver = db,
) => {
  await driver.insert(authCodes).values({
    ...authCode,
    code: authCode.authorizationCode,
    clientId: authCode.client.id,
    userId: authCode.user.id,
  });
};

export const revoke = async (authCode: string, driver = db) => {
  await driver.update(authCodes).set({
    expiresAt: new Date(),
  }).where(eq(authCodes.code, authCode));
};
