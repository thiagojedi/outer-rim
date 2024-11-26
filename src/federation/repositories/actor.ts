import { eq } from "drizzle-orm";
import { db, Driver } from "../../db/client.ts";
import { actors, users } from "../../db/models.ts";

export const getActorByIdentifier = async (
  identifier: string,
  driver: Driver = db,
) => {
  const [user] = await driver.select({ id: actors.id, name: actors.name }).from(
    users,
  )
    .innerJoin(actors, eq(actors.userId, users.id))
    .where(eq(users.username, identifier));

  return user ?? null;
};

export const createActor = async (
  values: typeof actors.$inferInsert,
  driver: Driver = db,
) => {
  const [newActor] = await driver.insert(actors).values(values).returning();

  return newActor;
};
