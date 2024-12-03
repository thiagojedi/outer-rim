import { eq } from "drizzle-orm";

import { db, Driver } from "../../../db/client.ts";
import { posts } from "../../../db/models.ts";

export const countActorsPosts = (actorId: number, driver: Driver = db) =>
  driver.$count(posts, eq(posts.actorId, actorId));

export const getPosts = (actorId: number, driver: Driver = db) =>
  driver.select().from(posts).where(eq(posts.actorId, actorId));
