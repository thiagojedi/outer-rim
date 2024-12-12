import { and, eq } from "drizzle-orm";
import { actors, follows } from "../../db/models.ts";
import { db, Driver } from "../../db/client.ts";

export const createFollow = (
  values: typeof follows.$inferInsert,
  driver: Driver = db,
) => driver.insert(follows).values(values);

export const deleteFollow = async (
  followerUri: string,
  followingUsername: string,
  driver: Driver = db,
) => {
  const follower = driver
    .select({ id: actors.id })
    .from(actors)
    .where(eq(actors.uri, followerUri));

  const following = driver
    .select({ id: actors.id })
    .from(actors)
    .where(eq(actors.handle, followingUsername));

  await driver
    .delete(follows)
    .where(and(
      eq(follows.followerId, follower),
      eq(follows.followingId, following),
    ));
};
