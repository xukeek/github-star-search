import { getDB } from "@/db";
import { SyncService } from "@/lib/sync-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 验证这是来自Cloudflare Cron的请求
    const cronSecret = request.headers.get("CF-Cron-Secret");
    if (!cronSecret) {
      return NextResponse.json(
        { error: "Unauthorized - not a cron request" },
        { status: 401 }
      );
    }

    const db = getDB();
    const syncService = new SyncService();

    // 获取所有有访问令牌的用户
    const users = await db.query.userTable.findMany({
      columns: {
        id: true,
        login: true,
        lastSyncAt: true,
      },
      where: (table, { isNotNull }) => isNotNull(table.accessToken),
    });

    console.log(`Starting scheduled sync for ${users.length} users`);

    const results = {
      totalUsers: users.length,
      successfulSyncs: 0,
      failedSyncs: 0,
      errors: [] as string[],
    };

    // 并发同步，但限制并发数避免超过API限制
    const concurrentLimit = 5;
    const batches = [];

    for (let i = 0; i < users.length; i += concurrentLimit) {
      batches.push(users.slice(i, i + concurrentLimit));
    }

    for (const batch of batches) {
      const promises = batch.map(async (user) => {
        try {
          console.log(`Syncing repositories for user ${user.login} (${user.id})`);

          const result = await syncService.syncUserRepos(user.id);

          console.log(
            `User ${user.login}: synced ${result.synced} repos, ${result.errors.length} errors`
          );

          results.successfulSyncs++;

          // 如果有错误，记录但不阻止其他用户的同步
          if (result.errors.length > 0) {
            results.errors.push(`${user.login}: ${result.errors.join(", ")}`);
          }

        } catch (error) {
          const errorMsg = `Failed to sync user ${user.login}: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
          results.failedSyncs++;
        }
      });

      // 等待当前批次完成
      await Promise.all(promises);

      // 在批次之间稍作延迟，避免超过GitHub API限制
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Scheduled sync completed:`, results);

    return NextResponse.json({
      success: true,
      message: `Sync completed for ${results.totalUsers} users`,
      details: {
        successful: results.successfulSyncs,
        failed: results.failedSyncs,
        totalErrors: results.errors.length,
      },
      errors: results.errors.slice(0, 10), // 只返回前10个错误，避免响应过大
    });

  } catch (error) {
    console.error("Scheduled sync failed:", error);
    return NextResponse.json(
      {
        error: "Scheduled sync failed",
        details: String(error)
      },
      { status: 500 }
    );
  }
}

// 支持GET请求用于手动触发（仅开发环境）
export async function GET(request: NextRequest) {
  // 只在开发环境允许GET请求
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "GET method only available in development" },
      { status: 405 }
    );
  }

  return POST(request);
}