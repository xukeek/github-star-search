import { getSessionFromCookie } from "@/utils/auth";
import { SyncService } from "@/lib/sync-service";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 验证用户身份
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const syncService = new SyncService();

    // 执行同步
    const result = await syncService.syncUserRepos(session.user.id);

    return NextResponse.json({
      success: true,
      synced: result.synced,
      errors: result.errors,
      message: `Successfully synced ${result.synced} repositories${result.errors.length > 0 ? ` with ${result.errors.length} errors` : ''}`
    });

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 验证用户身份
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const syncService = new SyncService();

    // 获取同步状态
    const [lastSyncTime, repoCount] = await Promise.all([
      syncService.getLastSyncTime(session.user.id),
      syncService.getUserRepoCount(session.user.id),
    ]);

    return NextResponse.json({
      lastSyncTime,
      repoCount,
      needsInitialSync: !lastSyncTime,
    });

  } catch (error) {
    console.error("Sync status error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}