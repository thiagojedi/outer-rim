import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./schemas.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./local.sqlite",
  },
  verbose: true,
  strict: true,
});
