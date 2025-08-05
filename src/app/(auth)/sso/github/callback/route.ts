import { github } from "@/lib/sso/github-sso";
import { cookies } from "next/headers";
import { GITHUB_OAUTH_STATE_COOKIE, REDIRECT_AFTER_SIGN_IN } from "@/constants";
import { getDB } from "@/db";
import { userTable } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
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
    const storedState = cookies().get(GITHUB_OAUTH_STATE_COOKIE)?.value ?? null;

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
            await createAndStoreSession(existingUser.id, "github");
            return new Response(null, {
                status: 302,
                headers: {
                    Location: REDIRECT_AFTER_SIGN_IN
                }
            });
        }

        const userId = `usr_${createId()}`;
        await db.insert(userTable).values({
            id: userId,
            githubId: githubUser.id,
            name: githubUser.name,
            email: githubUser.email,
            avatar: githubUser.avatar_url,
        });

        await createAndStoreSession(userId, "github");

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
