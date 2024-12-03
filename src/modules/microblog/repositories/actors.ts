import { eq } from "drizzle-orm";

import { db, Driver } from "../../../db/client.ts";
import { actors, users } from "../../../db/models.ts";

export async function getActorFromUsername(
  username: string,
  driver: Driver = db,
) {
  const [user] = await driver.select({
    id: actors.id,
    name: actors.name,
    created: actors.created,
  }).from(actors)
    .innerJoin(users, eq(users.id, actors.userId))
    .where(eq(users.username, username));
  return user;
}
