import { and, eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { authClients, redirectUris, scopes } from "../../db/models.ts";
import { generateRandomId } from "../../db/utils.ts";

type ClientAppPayload = {
  client_name: string;
  redirect_uris: string[];
  scopes: string;
  website: string;
};

const allowedGrants = [
  "authorization_code",
  "refresh_token",
];

export const createClientApp = (payload: ClientAppPayload): Promise<{
  "id": string;
  "name": string;
  "website": string;
  "scopes": string[];
  "redirect_uri": string;
  "redirect_uris": string[];
  "client_id": string;
  "client_secret": string;
}> =>
  db.transaction(async (tx) => {
    const {
      client_name: name,
      redirect_uris,
      scopes: appScopes,
      website,
    } = payload;

    const newClient = (await tx.insert(authClients).values({
      name,
      website,
      id: generateRandomId(),
      secret: generateRandomId(),
    }).returning()).at(0)!;

    const scopesArray = appScopes.split(" ");
    await tx.insert(scopes).values(
      scopesArray.map((name) => ({
        name,
        clientId: newClient.id,
      })),
    );

    await tx.insert(redirectUris).values(redirect_uris.map((uri) => ({
      uri,
      clientId: newClient.id,
    })));

    return {
      id: newClient.id,
      name: newClient.name,
      client_id: newClient.id,
      client_secret: newClient.secret,
      website: newClient.website ?? "",
      scopes: scopesArray,
      redirect_uri: redirect_uris.join("\n"),
      redirect_uris,
    };
  });

export const getByIdentifier = async (
  clientId: string,
  clientSecret?: string,
  driver = db,
) => {
  const response = await driver.select({
    id: authClients.id,
    name: authClients.name,
    website: authClients.website,
    scope: scopes.name,
    redirectUri: redirectUris.uri,
  }).from(authClients)
    .innerJoin(scopes, eq(authClients.id, scopes.clientId))
    .innerJoin(redirectUris, eq(authClients.id, redirectUris.clientId))
    .where(
      and(
        eq(authClients.id, clientId),
        clientSecret ? eq(authClients.secret, clientSecret) : undefined,
      ),
    );

  return {
    ...response.at(0)!,
    redirectUris: Array.from(new Set(response.map((r) => r.redirectUri))),
    scopes: response.map((r) => ({ name: r.scope })),
    grants: allowedGrants,
  };
};
