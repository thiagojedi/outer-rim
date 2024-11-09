import "$std/dotenv/load.ts";
import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./models.ts";

export const db = drizzle({
  connection: Deno.env.get("DB_CONNECTION")!,
  schema,
  casing: "snake_case",
});

export const prepareDb = async () => {
  await db.$client.executeMultiple(`
        PRAGMA journal_mode = wal ;
        PRAGMA foreign_keys = on ;
    `);
};
