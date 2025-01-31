import { eq } from "drizzle-orm";

import { db, Driver } from "../../../db/client.ts";
import { actors } from "../../../db/models.ts";
import { inArray } from "npm:drizzle-orm@0.38.4";

export async function getActorFromUsername(
  username: string,
  driver: Driver = db,
) {
  const [user] = await driver
    .select({ id: actors.id, created: actors.created })
    .from(actors)
    .where(eq(actors.identifier, username));
  return user;
}

export function getActors(ids: string[], driver: Driver = db) {
  return driver.select().from(actors).where(inArray(actors.id, ids));
}
