import { eq } from "drizzle-orm";

import { db, Driver } from "../../../db/client.ts";
import { follows } from "../../../db/models.ts";

export const countFollowingByActor = (actorId: string, driver: Driver = db) =>
  driver.$count(follows, eq(follows.followerId, actorId));

export const countFollowersByActor = (actorId: string, driver: Driver = db) =>
  driver.$count(follows, eq(follows.followingId, actorId));
