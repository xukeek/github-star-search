import type { Route } from "next"

export const SITE_NAME = "Starry AI Navigator"
export const SITE_DESCRIPTION = "Transform your GitHub Stars into a dynamic, searchable knowledge base. Find any starred repository in seconds with advanced filtering and AI-powered semantic search."
export const SITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://starry-ai-navigator.example.com" // TODO: 部署后更改为实际域名
export const GITHUB_REPO_URL = "https://github.com/your-username/starry-ai-navigator" // TODO: 更改为实际的 GitHub 仓库地址

export const SITE_DOMAIN = new URL(SITE_URL).hostname

export const SESSION_COOKIE_NAME = "session";
export const GITHUB_OAUTH_STATE_COOKIE = "github-oauth-state";
export const MAX_SESSIONS_PER_USER = 5;

// GitHub OAuth credentials - these should be set in your .dev.vars file
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export const REDIRECT_AFTER_SIGN_IN = "/dashboard" as Route;