import { and, eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { applications, redirectUris, scopes } from "../../db/models.ts";
import { generateRandomId } from "../../db/utils.ts";

type ClientAppPayload = {
  client_name: string;
  redirect_uris: string[];
  scopes: string;
  website: string;
};

export const createClientApp = (payload: ClientAppPayload) =>
  db.transaction(async (tx) => {
    const {
      client_name: name,
      redirect_uris,
      scopes: appScopes,
      website,
    } = payload;

    const [newApp] = await tx.insert(applications).values({
      name,
      website,
      client_id: generateRandomId(),
      client_secret: generateRandomId(),
    }).returning();

    const scopesArray = appScopes.split(" ").map((scope) => ({
      applicationId: newApp.id,
      scope,
    }));
    await tx.insert(scopes).values(scopesArray);
    await tx.insert(redirectUris).values(
      redirect_uris.map((uri) => ({ applicationId: newApp.id, uri })),
    );

    return {
      ...newApp,
      scopes: scopesArray.map((scope) => scope.scope),
      redirect_uris,
      "updatedAt": undefined,
      "createdAt": undefined,
      "deletedAt": undefined,
    };
  });

export const getAppClientUris = (
  clientId: string,
  clientSecret: string | null,
) =>
  db.select({
    id: applications.id,
    redirect_uris: redirectUris.uri,
    clientId: applications.client_id,
    clientSecret: applications.client_secret,
  })
    .from(applications)
    .leftJoin(redirectUris, eq(applications.id, redirectUris.applicationId))
    .where(
      and(
        eq(applications.client_id, clientId),
        clientSecret ? eq(applications.client_secret, clientSecret) : undefined,
      ),
    );

export const getAppInfo = async (clientId: string) => {
  const response = await db.select({
    name: applications.name,
    website: applications.website,
    scopes: scopes.scope,
    redirect_uris: redirectUris.uri,
  }).from(applications)
    .leftJoin(scopes, eq(applications.id, scopes.applicationId))
    .leftJoin(redirectUris, eq(applications.id, redirectUris.applicationId))
    .where(eq(applications.client_id, clientId));

  return response.reduce((prev, curr) => ({
    ...prev,
    scopes: curr.scopes ? [...prev.scopes, ...curr.scopes] : prev.scopes,
    redirect_uris: curr.redirect_uris
      ? [...prev.redirect_uris, ...curr.redirect_uris]
      : prev.redirect_uris,
  }), {
    ...response.at(0)!,
    scopes: [] as string[],
    redirect_uris: [] as string[],
  });
};
