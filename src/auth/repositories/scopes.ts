import { OAuthScope } from "@jmondi/oauth2-server";
import { db } from "../../db/client.ts";

export const getAllByIdentifiers = (scopeNames: string[], driver = db) =>
  driver.query.scopes.findMany({
    where: (scopes, { inArray }) => inArray(scopes.name, scopeNames),
  });

export const finalize = (scopes: OAuthScope[]) => Promise.resolve(scopes);
