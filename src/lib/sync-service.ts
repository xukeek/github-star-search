import "server-only";

import { getDB } from "@/db";
import { userTable, repoTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { GitHubClient, type GitHubStarredRepo } from "./github";
import { VectorService, type RepositoryWithUser } from "./vector-service";

export class SyncService {
  private db = getDB();
  private vectorService = new VectorService();

  async syncUserRepos(userId: string): Promise<{ synced: number; errors: string[] }> {
    // 获取用户的访问令牌
    const user = await this.db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
      columns: {
        accessToken: true,
        githubId: true,
      },
    });

    if (!user || !user.accessToken) {
      throw new Error("User not found or no access token available");
    }

    const github = new GitHubClient(user.accessToken);
    const errors: string[] = [];
    let syncedCount = 0;

    try {
      // 获取所有starred仓库
      const starredRepos = await github.getAllStarredRepos();

      console.log(`Found ${starredRepos.length} starred repos for user ${userId}`);

      // 批量处理仓库
      const reposToVectorize: RepositoryWithUser[] = [];

      for (const repo of starredRepos) {
        try {
          const syncedRepo = await this.syncSingleRepo(userId, repo, github);
          if (syncedRepo) {
            reposToVectorize.push(syncedRepo);
          }
          syncedCount++;
        } catch (error) {
          const errorMsg = `Failed to sync repo ${repo.full_name}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      // 批量向量化新同步的仓库
      if (reposToVectorize.length > 0) {
        try {
          console.log(`Starting vectorization for ${reposToVectorize.length} repositories...`);
          const vectorResult = await this.vectorService.vectorizeBatch(reposToVectorize);
          console.log(`Vectorized ${vectorResult.success} repositories, ${vectorResult.errors.length} errors`);
          errors.push(...vectorResult.errors);
        } catch (error) {
          console.error("Vectorization failed:", error);
          errors.push(`Vectorization failed: ${error}`);
        }
      }

      // 更新用户的最后同步时间
      await this.db.update(userTable)
        .set({ lastSyncAt: new Date() })
        .where(eq(userTable.id, userId));

    } catch (error) {
      const errorMsg = `Failed to fetch starred repos: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    return {
      synced: syncedCount,
      errors,
    };
  }

    private async syncSingleRepo(
    userId: string,
    githubRepo: GitHubStarredRepo,
    github: GitHubClient
  ): Promise<RepositoryWithUser | null> {
    // 检查仓库是否已存在
    const existingRepo = await this.db.query.repoTable.findFirst({
      where: and(
        eq(repoTable.userId, userId),
        eq(repoTable.githubId, githubRepo.id)
      ),
    });

    // 获取README内容（如果需要的话）
    let readmeContent: string | null = null;
    if (!existingRepo) {
      // 只有新仓库才获取README，避免重复请求
      try {
        readmeContent = await github.getRepoReadme(
          githubRepo.owner.login,
          githubRepo.name
        );
      } catch {
        // README获取失败，继续处理
        readmeContent = null;
      }
    }

    const repoData = {
      userId,
      githubId: githubRepo.id,
      name: githubRepo.name,
      fullName: githubRepo.full_name,
      owner: githubRepo.owner.login,
      description: githubRepo.description,
      language: githubRepo.language,
      stargazersCount: githubRepo.stargazers_count,
      topics: JSON.stringify(githubRepo.topics), // 存储为JSON字符串
      starredAt: new Date(githubRepo.starred_at),
      license: githubRepo.license?.key || null,
      pushedAt: githubRepo.pushed_at ? new Date(githubRepo.pushed_at) : null,
      archived: githubRepo.archived,
      url: githubRepo.html_url,
      readmeContent: readmeContent || existingRepo?.readmeContent || null,
    };

    if (existingRepo) {
      // 更新现有仓库
      await this.db.update(repoTable)
        .set(repoData)
        .where(eq(repoTable.id, existingRepo.id));

      // 返回更新后的仓库数据（用于向量化）
      return {
        id: existingRepo.id,
        githubId: repoData.githubId,
        name: repoData.name,
        fullName: repoData.fullName,
        owner: repoData.owner,
        description: repoData.description,
        language: repoData.language,
        stargazersCount: repoData.stargazersCount || 0,
        topics: JSON.parse(repoData.topics) as string[],
        starredAt: repoData.starredAt.toISOString(),
        license: repoData.license,
        pushedAt: repoData.pushedAt?.toISOString() || null,
        archived: repoData.archived || false,
        url: repoData.url || "",
        readmeContent: repoData.readmeContent,
        userId,
      };
    } else {
      // 创建新仓库
      const [newRepo] = await this.db.insert(repoTable).values(repoData).returning();

      // 返回新创建的仓库数据（用于向量化）
      return {
        id: newRepo.id,
        githubId: newRepo.githubId,
        name: newRepo.name,
        fullName: newRepo.fullName,
        owner: newRepo.owner,
        description: newRepo.description,
        language: newRepo.language,
        stargazersCount: newRepo.stargazersCount || 0,
        topics: JSON.parse(newRepo.topics || "[]") as string[],
        starredAt: newRepo.starredAt.toISOString(),
        license: newRepo.license,
        pushedAt: newRepo.pushedAt?.toISOString() || null,
        archived: newRepo.archived || false,
        url: newRepo.url || "",
        readmeContent: newRepo.readmeContent,
        userId,
      };
    }
  }

  async getLastSyncTime(userId: string): Promise<Date | null> {
    const user = await this.db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
      columns: {
        lastSyncAt: true,
      },
    });

    return user?.lastSyncAt || null;
  }

  async getUserRepoCount(userId: string): Promise<number> {
    const result = await this.db
      .select({ count: repoTable.id })
      .from(repoTable)
      .where(eq(repoTable.userId, userId));

    return result.length;
  }
}