import { and, eq } from "drizzle-orm";
import { db, Driver } from "../../db/client.ts";
import { actors, posts, users } from "../../db/models.ts";

export const getPost = async (
  username: string,
  postId: string,
  driver: Driver = db,
) => {
  const [post] = await driver.select().from(posts).innerJoin(
    actors,
    eq(actors.id, posts.actorId),
  )
    .innerJoin(users, eq(users.id, actors.userId))
    .where(and(
      eq(users.username, username),
      eq(posts.id, Number(postId)),
    ));
  return post;
};
