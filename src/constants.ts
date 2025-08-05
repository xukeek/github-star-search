import type { Route } from "next"

export const SITE_NAME = "Starry AI Navigator"
export const SITE_DESCRIPTION = "Transform your GitHub Stars into a dynamic, searchable knowledge base. Find any starred repository in seconds with advanced filtering and AI-powered semantic search."
export const SITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://your-production-url.com" // TODO: Change this
export const GITHUB_REPO_URL = "https://github.com/your-repo" // TODO: Change this

export const SITE_DOMAIN = new URL(SITE_URL).hostname

export const SESSION_COOKIE_NAME = "session";
export const GITHUB_OAUTH_STATE_COOKIE = "github-oauth-state";

export const REDIRECT_AFTER_SIGN_IN = "/dashboard" as Route;
