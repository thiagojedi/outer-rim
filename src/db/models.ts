import {
  customType,
  int,
  primaryKey,
  sqliteTable as table,
  text,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

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

const uuid = () => text().$defaultFn(() => crypto.randomUUID());
const bool = () => int({ mode: "boolean" });

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
  profileId: uuid().references(() => actors.id, {
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
  expiresAt: date().notNull(),

  clientId: text().notNull().references(() => authClients.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: int().notNull().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  profileId: uuid().references(() => actors.id, {
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

//#endregion

//#region Federation

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
  followingId: text().references(() => actors.id),
  followerId: text().references(() => actors.id),
  created: date().notNull().default(currentTime),
}, (table) => ({
  index: primaryKey({ columns: [table.followingId, table.followerId] }),
}));

export const posts = table("posts", {
  id: uuid().primaryKey(),
  uri: text().notNull().unique(),
  actorId: uuid().notNull().references(() => actors.id),
  url: url(),
  created: date().notNull().default(currentTime),
  content: text().notNull(),
});

export const actors = table("actors", {
  id: uuid().primaryKey(),
  identifier: text().unique(),
  userId: int().references(() => users.id),
  uri: text().notNull().unique(),
  handle: text().notNull().unique(),
  inboxUrl: url().notNull(),
  sharedInboxUrl: url(),
  url: url(),
  created: date().notNull().default(currentTime),
});

//#endregion

export const profiles = table("profiles", {
  name: text(),
  htmlBio: text(),

  manuallyApprovesFollowers: bool().default(false),
  discoverable: bool().default(true),
  indexable: bool().default(true),
  memorial: bool().default(false),
  silenced: bool().default(false),
  bot: bool().notNull().default(false),

  actorId: text().primaryKey().references(() => actors.id),
  avatarId: text().references(() => images.id),
  headerId: text().references(() => images.id),
});

export const images = table("images", {
  id: uuid().primaryKey(),
  type: text().notNull(),
  url: text().notNull(),
  description: text().notNull(),
});

export const emoji = table("emoji", {
  shortcode: text().notNull(),
  imageId: text().notNull().references(() => images.id),
});
