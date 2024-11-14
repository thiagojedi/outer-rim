import dayjs from "dayjs";

import { db } from "../../db/client.ts";
import { OAuthAuthCode } from "@jmondi/oauth2-server";
import { getByIdentifier as getClient } from "./clients.ts";

export async function getByIdentifier(
  authCodeCode: string,
  driver = db,
): Promise<OAuthAuthCode> {
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
}
