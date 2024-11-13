import { int, sqliteTable as table, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

const timestamps = {
  updatedAt: text(),
  createdAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text(),
};

export const applications = table("applications", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  website: text(),
  client_id: text().notNull().unique(),
  client_secret: text().notNull(),
  ...timestamps,
});

export const scopes = table("scopes", {
  applicationId: int().notNull().references(() => applications.id, {
    onDelete: "cascade",
  }),
  scope: text().notNull(),
});

export const redirectUris = table("redirect_uri", {
  applicationId: int().notNull().references(() => applications.id, {
    onDelete: "cascade",
  }),
  uri: text().notNull(),
});

export const users = table("users", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
});

export const tokens = table("auth_tokens", {
  accessToken: text().notNull(),
  accessTokenExpiresAt: text().notNull(),
  refreshToken: text(), // NOTE this is only needed if you need refresh tokens down the line
  refreshTokenExpiresAt: text(),
  clientId: int().notNull().references(() => applications.client_id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: int().notNull().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const tokenRelations = relations(tokens, ({ one }) => ({
  client: one(applications, {
    fields: [tokens.clientId],
    references: [applications.id],
  }),
  user: one(users, { fields: [tokens.userId], references: [users.id] }),
}));
