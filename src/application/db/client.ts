import "jsr:@std/dotenv/load";

import { drizzle } from "drizzle-orm/libsql/node";
import * as schema from "./models.ts";

export const db = drizzle({
  connection: Deno.env.get("DB_CONNECTION")!,
  schema,
  casing: "snake_case",
});
