import { generateState } from "arctic";
import { github } from "@/lib/sso/github-sso";
import { cookies } from "next/headers";
import { GITHUB_OAUTH_STATE_COOKIE } from "@/constants";

export async function GET(): Promise<Response> {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
        scopes: ["user:email", "read:user"],
    });

    cookies().set(GITHUB_OAUTH_STATE_COOKIE, state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });

    return Response.redirect(url);
}
