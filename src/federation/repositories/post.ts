import { and, eq } from "drizzle-orm";
import { db, Driver } from "../../db/client.ts";
import { actors, posts } from "../../db/models.ts";

export const getPost = async (
  username: string,
  postId: string,
  driver: Driver = db,
) => {
  const [post] = await driver
    .select()
    .from(posts)
    .innerJoin(actors, eq(actors.id, posts.actorId))
    .where(and(
      eq(actors.handle, username),
      eq(posts.id, postId),
    ));
  return post;
};
