# Starry AI Navigator (星海AI领航员)

Starry AI Navigator 是一款专为开发者设计的 Web 应用，旨在将用户的 GitHub Starred 仓库从一个静态的收藏夹，转变为一个动态、智能、可深度检索的个人技术知识库。

## 核心问题

开发者在 GitHub 上收藏了大量有价值的仓库，但原生功能难以解决“收藏即遗忘”的痛点：
*   **命名遗忘**: 常常只记得仓库功能，忘了确切名称。
*   **上下文缺失**: 无法按收藏时间、语言、许可证等关键信息筛选。
*   **搜索无力**: 无法理解自然语言描述，只能进行简单的关键词匹配。

本项目的愿景是让开发者能通过任何记忆片段——一个模糊的功能描述、一个具体的编程语言——在数秒内精准地从成百上千的收藏中找到所需仓库。

## 核心功能

*   **GitHub 认证**: 通过 GitHub OAuth 2.0 安全登录。
*   **仓库数据同步**: 自动同步用户所有 Starred 的仓库元数据。
*   **精确筛选**: 支持通过关键词、编程语言、主题、Star数、所有者、收藏时间等多维度组合筛选。
*   **智能语义搜索**: 基于自然语言描述，利用 AI Embedding 和向量搜索理解用户意图，找到最相关的仓库。
*   **融合式搜索**: 无缝结合精确筛选和智能搜索，实现最高效的知识库检索。

## 技术栈

*   **Web 框架**: Next.js (App Router) + OpenNext
*   **部署平台**: Cloudflare Pages & Workers
*   **SQL 数据库**: Cloudflare D1 (存储仓库元数据)
*   **Vector 数据库**: Cloudflare Vectorize (存储 README 向量)
*   **AI 模型**: Cloudflare Workers AI (用于 Embedding)
*   **认证**: Lucia Auth

## 本地运行

1.  `pnpm install`
2.  复制 `.dev.vars.example` 到 `.dev.vars` 并填入必要的环境变量 (如 GitHub OAuth Client ID 和 Secret)。
3.  复制 `.env.example` 到 `.env` 并填入必要的环境变量。
4.  `pnpm db:migrate:dev` - 创建本地 SQLite 数据库并应用迁移。
5.  `pnpm dev`
6.  访问 http://localhost:3000

## 部署

部署流程基于 Cloudflare 和 GitHub Actions。
1.  在 Cloudflare 创建 D1 数据库和 Vectorize 索引。
2.  更新 `wrangler.jsonc`，填入你的 Cloudflare account ID 以及新创建的 D1 和 Vectorize 的绑定信息。
3.  在 GitHub 仓库的 Secrets 中设置 `CLOUDFLARE_API_TOKEN`。
4.  在 GitHub 仓库的 Variables 中设置 `CLOUDFLARE_ACCOUNT_ID`。
5.  将代码推送到 `main` 分支，GitHub Actions 将会自动完成部署。
