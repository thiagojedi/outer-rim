import { and, desc, eq } from "drizzle-orm";
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

export const countPosts = (actorId: string, driver: Driver = db) =>
  driver.$count(posts, eq(posts.actorId, actorId));

export const getLastPostDate = async (actorId: string, driver: Driver = db) => {
  const [post] = await driver
    .select({ created: posts.created })
    .from(posts)
    .where(eq(posts.actorId, actorId))
    .orderBy(desc(posts.created))
    .limit(1);
  return post?.created ?? null;
};
