import { eq } from "drizzle-orm";

import { db, Driver } from "../../../db/client.ts";
import { actors } from "../../../db/models.ts";

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
