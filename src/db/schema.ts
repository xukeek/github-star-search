import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
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

// 用户表 - 简化版，只保留GitHub授权所需字段
export const userTable = sqliteTable("user", {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `usr_${createId()}`).notNull(),
  githubId: text().unique().notNull(), // GitHub用户ID
  login: text().notNull(), // GitHub用户名
  name: text(), // GitHub显示名称
  email: text(),
  avatar: text(), // GitHub头像URL
  accessToken: text(), // GitHub访问令牌（加密存储）
  lastSyncAt: integer({ mode: "timestamp" }), // 最后同步时间
}, (table) => ({
  githubIdIdx: index('user_github_id_idx').on(table.githubId),
  loginIdx: index('user_login_idx').on(table.login),
}));

// 仓库表 - 根据PDD文档设计
export const repoTable = sqliteTable('repo', {
  ...commonColumns,
  id: text().primaryKey().$defaultFn(() => `repo_${createId()}`),
  userId: text().notNull().references(() => userTable.id, { onDelete: 'cascade' }),

  // Core Fields (来自PDD文档)
  githubId: integer().notNull(), // GitHub仓库ID
  name: text().notNull(), // 仓库名
  fullName: text().notNull(), // owner/repo格式
  owner: text().notNull(), // 所有者
  description: text(), // 描述
  language: text(), // 主要编程语言
  stargazersCount: integer().default(0), // Star数
  topics: text(), // 主题标签，存储为JSON字符串
  starredAt: integer({ mode: "timestamp" }).notNull(), // 收藏时间

  // Advanced Fields (来自PDD文档)
  license: text(), // 许可证
  pushedAt: integer({ mode: "timestamp" }), // 最后推送时间
  archived: integer({ mode: "boolean" }).default(false), // 是否归档

  // Other Fields
  url: text(), // GitHub URL
  readmeContent: text(), // README内容，用于向量化

  // 复合唯一约束：用户+仓库
}, (table) => ({
  userIdIdx: index('repo_user_id_idx').on(table.userId),
  githubIdIdx: index('repo_github_id_idx').on(table.githubId),
  userRepoIdx: index('repo_user_repo_idx').on(table.userId, table.githubId), // 复合索引
  languageIdx: index('repo_language_idx').on(table.language),
  stargazersCountIdx: index('repo_stars_idx').on(table.stargazersCount),
  starredAtIdx: index('repo_starred_at_idx').on(table.starredAt),
  ownerIdx: index('repo_owner_idx').on(table.owner),
  pushedAtIdx: index('repo_pushed_at_idx').on(table.pushedAt),
}));

// 关系定义
export const userRelations = relations(userTable, ({ many }) => ({
  repos: many(repoTable),
}));

export const repoRelations = relations(repoTable, ({ one }) => ({
  user: one(userTable, {
    fields: [repoTable.userId],
    references: [userTable.id],
  }),
}));

// TypeScript类型导出
export type User = InferSelectModel<typeof userTable>;
export type Repo = InferSelectModel<typeof repoTable>;

// 插入类型
export type NewUser = typeof userTable.$inferInsert;
export type NewRepo = typeof repoTable.$inferInsert;
