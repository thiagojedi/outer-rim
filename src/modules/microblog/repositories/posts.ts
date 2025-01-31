import { and, desc, eq, type SQL } from "drizzle-orm";

import { db, Driver } from "../../../db/client.ts";
import { actors, posts, profiles } from "../../../db/models.ts";

export const countActorsPosts = (actorId: string, driver: Driver = db) =>
  driver.$count(posts, eq(posts.actorId, actorId));

export const getPostsFromActor = (actorId: string, driver: Driver = db) =>
  driver
    .select()
    .from(posts)
    .where(eq(posts.actorId, actorId))
    .orderBy(
      desc(posts.created),
    )
    .limit(20);

export const getPosts = (
  _params: Partial<{
    minId: null | string;
    maxId: null | string;
    sinceId: null | string;
  }>,
  limit = 20,
  driver: Driver = db,
) => {
  const filters: SQL[] = [];

  return driver
    .select()
    .from(posts)
    .innerJoin(actors, eq(posts.actorId, actors.id))
    .innerJoin(profiles, eq(posts.actorId, profiles.actorId))
    .where(and(...filters))
    .orderBy(
      desc(posts.created),
    )
    .limit(limit);
};
