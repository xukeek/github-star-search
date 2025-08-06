import { Metadata } from "next";
import { getSessionFromCookie } from "@/utils/auth";
import { redirect } from "next/navigation";
import { SyncService } from "@/lib/sync-service";
import { DashboardClient } from "./dashboard.client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your GitHub starred repositories",
};

export default async function DashboardPage() {
  const session = await getSessionFromCookie();

  if (!session) {
    redirect("/sign-in");
  }

  const syncService = new SyncService();

  // 获取用户的同步状态
  const [lastSyncTime, repoCount] = await Promise.all([
    syncService.getLastSyncTime(session.user.id),
    syncService.getUserRepoCount(session.user.id),
  ]);

  const needsInitialSync = !lastSyncTime;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <DashboardClient
          user={session.user}
          initialSyncData={{
            lastSyncTime: lastSyncTime?.toISOString() || null,
            repoCount,
            needsInitialSync,
          }}
        />
      </div>
    </div>
  );
}
