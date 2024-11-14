import { int, sqliteTable as table, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const authClients = table("applications", {
  id: text().primaryKey(),
  name: text().notNull(),
  secret: text().notNull(),
  website: text(),
});

export const scopes = table("scopes", {
  name: text().notNull(),
  clientId: text().notNull().references(() => authClients.id, {
    onDelete: "cascade",
  }),
});

export const redirectUris = table("redirect_uri", {
  uri: text().notNull(),
  clientId: text().notNull().references(() => authClients.id, {
    onDelete: "cascade",
  }),
});
export const users = table("users", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
});

export const tokens = table("auth_tokens", {
  accessToken: text().notNull(),
  accessTokenExpiresAt: text().notNull(),
  refreshToken: text(),
  refreshTokenExpiresAt: text(),

  originatingAuthCodeId: text(),

  clientId: text().notNull().references(() => authClients.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: int().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const tokenRelations = relations(tokens, ({ one }) => ({
  client: one(authClients, {
    fields: [tokens.clientId],
    references: [authClients.id],
  }),
  user: one(users, { fields: [tokens.userId], references: [users.id] }),
}));

export const authCodes = table("authorization_codes", {
  code: text().notNull(),
  redirectUri: text(),
  codeChallenge: text(),
  codeChallengeMethod: text(),
  expiresAt: text(),

  clientId: text().notNull().references(() => authClients.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: int().notNull().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const authCodeRelations = relations(authCodes, ({ one }) => ({
  client: one(authClients, {
    fields: [authCodes.clientId],
    references: [authClients.id],
  }),
  user: one(users, { fields: [authCodes.userId], references: [users.id] }),
}));
