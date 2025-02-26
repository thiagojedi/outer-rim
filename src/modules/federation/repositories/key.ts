import { db, Driver } from "../../../db/client.ts";
import { keys } from "../../../db/models.ts";

export const getKeysForUser = (userId: string, driver: Driver = db) =>
  driver.query.keys.findMany({
    where: (keys, { eq }) => eq(keys.userId, userId),
  });

export const createKey = (
  values: typeof keys.$inferInsert,
  driver: Driver = db,
) => driver.insert(keys).values(values);
