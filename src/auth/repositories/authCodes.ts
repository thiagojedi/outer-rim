import dayjs from "dayjs";
import type {
  OAuthAuthCode,
  OAuthClient,
  OAuthScope,
  OAuthUser,
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

  const client = await getClient(authCode!.clientId, driver);
  return {
    ...authCode,
    codeChallengeMethod: "plain",
    client,
    scopes: client.scopes,
    expiresAt: dayjs(authCode.expiresAt).toDate(),
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
  expiresAt: dayjs().add(15, "minutes").toDate(),
  client,
  user,
  scopes,
});

export const persist = async (authCode: OAuthAuthCode, driver = db) => {
  await driver.insert(authCodes).values({
    ...authCode,
    clientId: authCode.client.id,
    userId: Number(authCode.user!.id),
    expiresAt: dayjs(authCode.expiresAt).toISOString(),
  });
};

export const isRevoked = async (authCode: string, driver = db) => {
  const persisted = await driver.query.authCodes.findFirst({
    columns: { expiresAt: true },
    where: (authCodes, { eq }) => eq(authCodes.code, authCode),
  });
  if (!persisted) {
    return true;
  }
  return dayjs().isAfter(dayjs(persisted.expiresAt));
};

export const revoke = async (authCode: string, driver = db) => {
  await driver.update(authCodes).set({
    expiresAt: dayjs().toISOString(),
  }).where(eq(authCodes.code, authCode));
};
