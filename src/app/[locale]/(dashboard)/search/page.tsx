import { Metadata } from "next";
import { getSessionFromCookie } from "@/utils/auth";
import { redirect } from "next/navigation";
import { SearchClient } from "./search.client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search your GitHub starred repositories with AI-powered semantic search",
};

export default async function SearchPage() {
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Your Repositories</h1>
          <p className="text-muted-foreground text-lg">
            Find any starred repository with natural language or precise filters
          </p>
        </div>

        <SearchClient userId={session.user.id} />
      </div>
    </div>
  );
}