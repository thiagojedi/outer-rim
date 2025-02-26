import { eq, sql } from "drizzle-orm";
import { db, Driver } from "../../../db/client.ts";
import { actors, profiles } from "../../../db/models.ts";

export const getActorByIdentifier = async (
  identifier: string,
  driver: Driver = db,
) => {
  const [user] = await driver.select({
    id: actors.id,
    name: profiles.name,
    created: actors.created,
    url: actors.url,
    bio: profiles.htmlBio,
  })
    .from(actors)
    .innerJoin(profiles, eq(profiles.actorId, actors.id))
    .where(eq(actors.identifier, identifier));

  return user ?? null;
};

export const getActorProfileById = async (id: string, driver: Driver = db) => {
  const [actor] = await driver.select()
    .from(actors)
    .innerJoin(profiles, eq(profiles.actorId, actors.id))
    .where(eq(actors.id, id));

  return actor;
};

export const createActor = async (
  values: typeof actors.$inferInsert,
  driver: Driver = db,
) => {
  const [newActor] = await driver
    .insert(actors)
    .values(values)
    .onConflictDoUpdate({
      target: actors.uri,
      set: {
        handle: sql`excluded.handle`,
        inboxUrl: sql`excluded.inbox_url`,
        sharedInboxUrl: sql`excluded.shared_inbox_url`,
        url: sql`excluded.url`,
      },
      setWhere: sql`actors.uri = excluded.uri`,
    })
    .returning();

  return newActor;
};
