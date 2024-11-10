import { defineConfig } from "drizzle-kit";
import process from "node:process";

export default defineConfig({
  schema: "./src/db/models.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_CONNECTION!,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
});
