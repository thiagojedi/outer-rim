import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

const timestamps = {
  updatedAt: text(),
  createdAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text(),
};

export const applications = sqliteTable("applications", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  website: text(),
  client_id: text(),
  client_secret: text(),
  ...timestamps,
});

export const applicationsRelations = relations(applications, ({ many }) => ({
  scopes: many(scopes),
  redirectUris: many(redirectUris),
}));

export const scopes = sqliteTable("scopes", {
  applicationId: int().notNull().references(() => applications.id, {
    onDelete: "cascade",
  }),
  scope: text().notNull(),
});

export const scopesRelations = relations(scopes, ({ one }) => ({
  application: one(applications, {
    fields: [scopes.applicationId],
    references: [applications.id],
  }),
}));

export const redirectUris = sqliteTable("redirect_uri", {
  applicationId: int().notNull().references(() => applications.id, {
    onDelete: "cascade",
  }),
  uri: text().notNull(),
});

export const redirectUrisRelations = relations(redirectUris, ({ one }) => ({
  application: one(applications, {
    fields: [redirectUris.applicationId],
    references: [applications.id],
  }),
}));
