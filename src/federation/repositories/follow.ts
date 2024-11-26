import { and, eq } from "drizzle-orm";
import { actors, follows, users } from "../../db/models.ts";
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
  const actorBeingFollowed = driver.$with("follower").as(
    driver.select({ id: actors.id }).from(actors).innerJoin(
      users,
      eq(users.id, actors.userId),
    ).where(eq(users.username, followingUsername)),
  );
  const actorFollowing = driver.$with("following").as(
    driver.select({ id: actors.id }).from(actors).where(
      eq(actors.uri, followerUri),
    ),
  );

  await driver.delete(follows).where(and(
    eq(follows.followerId, actorFollowing),
    eq(follows.followingId, actorBeingFollowed.id),
  ));
};
