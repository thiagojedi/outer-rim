import "@std/dotenv/load";
import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./models.ts";
import {
  LibSQLDatabase as Database,
  LibSQLTransaction as Transaction,
} from "drizzle-orm/libsql";
import { ExtractTablesWithRelations } from "drizzle-orm";

export const db = drizzle({
  connection: Deno.env.get("DB_CONNECTION")!,
  schema,
  casing: "snake_case",
  logger: true,
});

export const prepareDb = async () => {
  await db.$client.executeMultiple(`
        PRAGMA journal_mode = wal ;
        PRAGMA foreign_keys = on ;
    `);
};

export type Driver =
  | Database<typeof schema>
  | Transaction<typeof schema, ExtractTablesWithRelations<typeof schema>>;
