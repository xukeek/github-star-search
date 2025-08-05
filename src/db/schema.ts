import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { type InferSelectModel } from "drizzle-orm";

import { createId } from '@paralleldrive/cuid2'

const commonColumns = {
  createdAt: integer({
    mode: "timestamp",
  }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer({
    mode: "timestamp",
  }).$onUpdateFn(() => new Date()).notNull(),
}

export const userTable = sqliteTable("user", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `usr_${createId()}`).notNull(),
  name: text({
    length: 255,
  }),
  email: text({
    length: 255,
  }).unique(),
  githubId: text({
    length: 255,
  }).unique(),
  avatar: text({
    length: 600,
  }),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  githubIdIdx: index('github_id_idx').on(table.githubId),
}));

export const repoTable = sqliteTable('repo', {
    ...commonColumns,
    id: text('id').primaryKey().$defaultFn(() => `repo_${createId()}`),
    userId: text('user_id').notNull().references(() => userTable.id),

    githubId: integer('github_id').unique().notNull(),
    name: text('name').notNull(),
    fullName: text('full_name').unique().notNull(),
    owner: text('owner').notNull(),
    description: text('description'),
    language: text('language'),
    stargazersCount: integer('stargazers_count'),
    topics: text('topics', { mode: 'json' }).$type<string[]>(), // Stored as JSON string: '["topic1", "topic2"]'
    starredAt: integer('starred_at', { mode: 'timestamp' }).notNull(),

    // Advanced Fields
    license: text('license'),
    pushedAt: integer('pushed_at', { mode: 'timestamp' }),
    archived: integer('archived', { mode: 'boolean' }),

    // Other
    url: text('url'),
    readmeContent: text('readme_content'), // For vectorization
}, (table) => ({
    userIdx: index('user_id_idx').on(table.userId),
    githubIdIdx: index('repo_github_id_idx').on(table.githubId),
    languageIdx: index('language_idx').on(table.language),
    stargazersCountIdx: index('stargazers_count_idx').on(table.stargazersCount),
    starredAtIdx: index('starred_at_idx').on(table.starredAt),
}));


export const passKeyCredentialTable = sqliteTable("passkey_credential", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `pkey_${createId()}`),
  userId: text().notNull().references(() => userTable.id),
  credentialId: text({
    length: 255,
  }).notNull().unique(),
  credentialPublicKey: text({
    length: 255,
  }).notNull(),
  counter: integer().notNull(),
  transports: text({
    length: 255,
  }),
  aaguid: text({
    length: 255,
  }),
  userAgent: text({
    length: 255,
  }),
  ipAddress: text({
    length: 100,
  }),
}, (table) => ({
  userIdx: index('passkey_user_id_idx').on(table.userId),
  credentialIdIdx: index('credential_id_idx').on(table.credentialId),
}));

export const userRelations = relations(userTable, ({ many }) => ({
  passkeys: many(passKeyCredentialTable),
  repos: many(repoTable),
}));

export const repoRelations = relations(repoTable, ({ one }) => ({
    user: one(userTable, {
        fields: [repoTable.userId],
        references: [userTable.id],
    }),
}));

export const passKeyCredentialRelations = relations(passKeyCredentialTable, ({ one }) => ({
  user: one(userTable, {
    fields: [passKeyCredentialTable.userId],
    references: [userTable.id],
  }),
}));

export type User = InferSelectModel<typeof userTable>;
export type Repo = InferSelectModel<typeof repoTable>;
export type PassKeyCredential = InferSelectModel<typeof passKeyCredentialTable>;
