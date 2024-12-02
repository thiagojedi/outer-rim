import { eq } from "drizzle-orm";
import { db, Driver } from "../../../db/client.ts";
import { actors, users } from "../../../db/models.ts";

export const getActorByUserId = (userId: number, driver: Driver = db) =>
  driver.select({ id: actors.id, username: users.username }).from(actors)
    .innerJoin(users, eq(users.id, actors.userId)).where(
      eq(actors.userId, userId),
    );
