import { eq } from "drizzle-orm";

import { posts } from "../../../db/models.ts";
import { db, Driver } from "../../../db/client.ts";

export const createPost = (
  post: typeof posts.$inferInsert,
  driver: Driver = db,
) => driver.insert(posts).values(post).returning();

export const updatePostUri = (
  postId: number,
  values: Partial<typeof posts.$inferInsert>,
  driver: Driver = db,
) => driver.update(posts).set(values).where(eq(posts.id, postId));
