import { github } from "@/lib/sso/github-sso";
import { cookies } from "next/headers";
import { GITHUB_OAUTH_STATE_COOKIE, REDIRECT_AFTER_SIGN_IN } from "@/constants";
import { getDB } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAndStoreSession } from "@/utils/auth";

interface GitHubUser {
    id: string;
    login: string;
    avatar_url: string;
    name: string;
    email: string;
}

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const storedState = cookieStore.get(GITHUB_OAUTH_STATE_COOKIE)?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const githubUser = await githubUserResponse.json() as GitHubUser;

        const db = getDB();
        const existingUser = await db.query.userTable.findFirst({
            where: eq(userTable.githubId, githubUser.id),
        });

        if (existingUser) {
            // 更新用户的访问令牌（可能已过期需要刷新）
            await db.update(userTable)
                .set({
                    accessToken: tokens.accessToken,
                })
                .where(eq(userTable.id, existingUser.id));

            await createAndStoreSession(existingUser.id, "github-oauth");
            return new Response(null, {
                status: 302,
                headers: {
                    Location: REDIRECT_AFTER_SIGN_IN
                }
            });
        }

        // 创建新用户
        const [newUser] = await db.insert(userTable).values({
            githubId: githubUser.id,
            login: githubUser.login,
            name: githubUser.name,
            email: githubUser.email,
            avatar: githubUser.avatar_url,
            accessToken: tokens.accessToken, // 存储访问令牌用于API调用
        }).returning({ id: userTable.id });

        await createAndStoreSession(newUser.id, "github-oauth");

        return new Response(null, {
            status: 302,
            headers: {
                Location: REDIRECT_AFTER_SIGN_IN
            }
        });
    } catch (e) {
        console.error(e);
        // TODO: Handle different error cases
        return new Response(null, {
            status: 500
        });
    }
}
