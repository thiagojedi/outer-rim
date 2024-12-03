import {
  customType,
  int,
  primaryKey,
  sqliteTable as table,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const currentTime = sql`(strftime('%FT%R:%fZ'))`;
const date = customType<{
  data: Date;
  driverData: string;
}>({
  dataType: () => "text",
  toDriver: (value) => value.toISOString(),
  fromDriver: (value) => new Date(Date.parse(value)),
});

const url = customType<{ data: URL; driverData: string }>({
  dataType: () => "text",
  toDriver: (value) => value.href,
  fromDriver: (value) => new URL(value),
});

//#region Auth

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
  email: text().notNull().unique(),
  password: text().notNull(),
});

export const tokens = table("auth_tokens", {
  accessToken: text().notNull(),
  accessTokenExpiresAt: date().notNull(),
  refreshToken: text(),
  refreshTokenExpiresAt: date(),

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

export const authCodes = table("authorization_codes", {
  code: text().notNull(),
  redirectUri: text(),
  codeChallenge: text(),
  codeChallengeMethod: text(),
  expiresAt: date().notNull(),

  clientId: text().notNull().references(() => authClients.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: int().notNull().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

//#endregion

//#region Federation

export const actors = table("actors", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  userId: int().references(() => users.id),
  uri: text().notNull().unique(),
  handle: text().notNull().unique(),
  name: text(),
  inboxUrl: url().notNull(),
  sharedInboxUrl: url(),
  url: url(),
  created: date().notNull().default(currentTime),
});

export const keys = table("keys", {
  userId: int().notNull().references(() => users.id),
  type: text({
    enum: ["Ed25519", "RSASSA-PKCS1-v1_5"],
  }),
  privateKey: text().notNull(),
  publicKey: text().notNull(),
  created: date().notNull().default(currentTime),
}, (table) => ({
  pk: primaryKey({
    columns: [table.userId, table.type],
  }),
}));

export const follows = table("follows", {
  followingId: int().references(() => actors.id),
  followerId: int().references(() => actors.id),
  created: date().notNull().default(currentTime),
}, (table) => ({
  index: primaryKey({ columns: [table.followingId, table.followerId] }),
}));

export const posts = table("posts", {
  id: int().primaryKey().notNull(),
  uri: text().notNull().unique(),
  actorId: int().notNull().references(() => actors.id),
  url: url(),
  created: date().notNull().default(currentTime),
  content: text().notNull(),
});

//#endregion

export const settings = table("settings", {
  key: text().primaryKey().notNull(),
  value: text(),
});
