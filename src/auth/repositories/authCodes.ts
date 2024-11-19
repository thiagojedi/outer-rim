import {
  DateInterval,
  type OAuthAuthCode,
  type OAuthClient,
  type OAuthScope,
  type OAuthUser,
} from "@jmondi/oauth2-server";
import { eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { getByIdentifier as getClient } from "./clients.ts";
import { generateRandomId } from "../../db/utils.ts";
import { authCodes } from "../../db/models.ts";

export const getByIdentifier = async (
  authCodeCode: string,
  driver = db,
): Promise<OAuthAuthCode> => {
  const authCode = (await driver.query.authCodes.findFirst({
    where: (authCodes, { eq }) => eq(authCodes.code, authCodeCode),
  }))!;

  const client = await getClient(authCode.clientId, driver);
  return {
    ...authCode,
    codeChallengeMethod: "plain",
    client,
    scopes: client.scopes,
  };
};

export const issueAuthCode = (
  client: OAuthClient,
  user: OAuthUser | undefined,
  scopes: OAuthScope[],
): OAuthAuthCode => ({
  redirectUri: null,
  code: generateRandomId(),
  codeChallenge: null,
  codeChallengeMethod: "S256",
  expiresAt: new DateInterval("15m").getEndDate(),
  client,
  user,
  scopes,
});

export const persist = async (authCode: OAuthAuthCode, driver = db) => {
  await driver.insert(authCodes).values({
    ...authCode,
    clientId: authCode.client.id,
    userId: Number(authCode.user!.id),
  });
};

export const isRevoked = async (authCode: string, driver = db) => {
  const auth = await getByIdentifier(authCode, driver);
  return new Date() > auth.expiresAt;
};

export const revoke = async (authCode: string, driver = db) => {
  await driver.update(authCodes).set({
    expiresAt: new Date(),
  }).where(eq(authCodes.code, authCode));
};
