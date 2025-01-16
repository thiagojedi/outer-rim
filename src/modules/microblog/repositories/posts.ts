import { eq } from "drizzle-orm";

import { db, Driver } from "../../../db/client.ts";
import { posts } from "../../../db/models.ts";

export const countActorsPosts = (actorId: string, driver: Driver = db) =>
  driver.$count(posts, eq(posts.actorId, actorId));

export const getPosts = (actorId: string, driver: Driver = db) =>
  driver.select().from(posts).where(eq(posts.actorId, actorId));
