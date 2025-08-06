import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/utils/auth";
import { getDB } from "@/db";
import { repoTable } from "@/db/schema";
import { eq, and, gte, lte, like, sql } from "drizzle-orm";
import { VectorService } from "@/lib/vector-service";

export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const isAiSearch = searchParams.get("ai") === "true";

    // 如果是AI搜索但没有查询字符串，返回错误
    if (isAiSearch && !query?.trim()) {
      return NextResponse.json(
        { error: "AI search requires a query" },
        { status: 400 }
      );
    }

    const db = getDB();

    // 构建基础查询条件
    const conditions = [eq(repoTable.userId, session.user.id)];

    // 处理各种筛选条件
    const keyword = searchParams.get("keyword");
    if (keyword?.trim()) {
      conditions.push(
        sql`(${repoTable.name} LIKE ${`%${keyword}%`} OR ${repoTable.description} LIKE ${`%${keyword}%`})`
      );
    }

    const language = searchParams.get("language");
    if (language?.trim()) {
      conditions.push(eq(repoTable.language, language));
    }

    const owner = searchParams.get("owner");
    if (owner?.trim()) {
      conditions.push(like(repoTable.owner, `%${owner}%`));
    }

    const topics = searchParams.get("topics");
    if (topics?.trim()) {
      const topicList = topics.split(",").map(t => t.trim()).filter(Boolean);
      if (topicList.length > 0) {
        // 搜索包含任一标签的仓库
        const topicConditions = topicList.map(topic =>
          like(repoTable.topics, `%"${topic}"%`)
        );
        conditions.push(sql`(${sql.join(topicConditions, sql` OR `)})`);
      }
    }

    const stargazersMin = searchParams.get("stargazers_min");
    if (stargazersMin && !isNaN(parseInt(stargazersMin))) {
      conditions.push(gte(repoTable.stargazersCount, parseInt(stargazersMin)));
    }

    const stargazersMax = searchParams.get("stargazers_max");
    if (stargazersMax && !isNaN(parseInt(stargazersMax))) {
      conditions.push(lte(repoTable.stargazersCount, parseInt(stargazersMax)));
    }

    const starredAfter = searchParams.get("starred_after");
    if (starredAfter) {
      conditions.push(gte(repoTable.starredAt, new Date(starredAfter)));
    }

    const starredBefore = searchParams.get("starred_before");
    if (starredBefore) {
      conditions.push(lte(repoTable.starredAt, new Date(starredBefore)));
    }

    const pushedAfter = searchParams.get("pushed_after");
    if (pushedAfter) {
      conditions.push(gte(repoTable.pushedAt, new Date(pushedAfter)));
    }

    const pushedBefore = searchParams.get("pushed_before");
    if (pushedBefore) {
      conditions.push(lte(repoTable.pushedAt, new Date(pushedBefore)));
    }

    const license = searchParams.get("license");
    if (license?.trim()) {
      conditions.push(eq(repoTable.license, license));
    }

    const archived = searchParams.get("archived");
    if (archived !== null && archived !== "") {
      conditions.push(eq(repoTable.archived, archived === "true"));
    }

    interface ProcessedRepo {
      id: string;
      githubId: number;
      name: string;
      fullName: string;
      owner: string;
      description: string | null;
      language: string | null;
      stargazersCount: number | null;
      topics: string[];
      starredAt: string;
      license: string | null;
      pushedAt: string | null;
      archived: boolean | null;
      url: string | null;
      readmeContent: string | null;
    }

    let processedRepos: ProcessedRepo[];

    // 如果是AI搜索，使用向量搜索
    if (isAiSearch && query?.trim()) {
      try {
        const vectorService = new VectorService();
        const { repos: vectorRepos } = await vectorService.searchSimilar(
          query,
          session.user.id,
          50
        );

        // 如果有额外的筛选条件，需要在向量搜索结果上应用
        if (conditions.length > 1) { // 排除userId条件
          const repoIds = vectorRepos.map(r => r.id);
          if (repoIds.length > 0) {
            // 对向量搜索结果应用SQL筛选
            const filteredRepos = await db
              .select({
                id: repoTable.id,
                githubId: repoTable.githubId,
                name: repoTable.name,
                fullName: repoTable.fullName,
                owner: repoTable.owner,
                description: repoTable.description,
                language: repoTable.language,
                stargazersCount: repoTable.stargazersCount,
                topics: repoTable.topics,
                starredAt: repoTable.starredAt,
                license: repoTable.license,
                pushedAt: repoTable.pushedAt,
                archived: repoTable.archived,
                url: repoTable.url,
                readmeContent: repoTable.readmeContent,
              })
              .from(repoTable)
              .where(and(...conditions))
              .limit(50);

            processedRepos = filteredRepos.map(repo => ({
              ...repo,
              topics: repo.topics ? JSON.parse(repo.topics) : [],
              starredAt: repo.starredAt.toISOString(),
              pushedAt: repo.pushedAt?.toISOString() || null,
            }));
          } else {
            processedRepos = [];
          }
        } else {
          // 没有额外筛选条件，直接使用向量搜索结果
          processedRepos = vectorRepos;
        }
      } catch (error) {
        console.error("Vector search failed, falling back to keyword search:", error);
        // 向量搜索失败，降级到关键词搜索
        conditions.push(
          sql`(${repoTable.name} LIKE ${`%${query}%`} OR ${repoTable.description} LIKE ${`%${query}%`} OR ${repoTable.readmeContent} LIKE ${`%${query}%`})`
        );

        const repos = await db
          .select({
            id: repoTable.id,
            githubId: repoTable.githubId,
            name: repoTable.name,
            fullName: repoTable.fullName,
            owner: repoTable.owner,
            description: repoTable.description,
            language: repoTable.language,
            stargazersCount: repoTable.stargazersCount,
            topics: repoTable.topics,
            starredAt: repoTable.starredAt,
            license: repoTable.license,
            pushedAt: repoTable.pushedAt,
            archived: repoTable.archived,
            url: repoTable.url,
            readmeContent: repoTable.readmeContent,
          })
          .from(repoTable)
          .where(and(...conditions))
          .orderBy(sql`${repoTable.stargazersCount} DESC`)
          .limit(50);

        processedRepos = repos.map(repo => ({
          ...repo,
          topics: repo.topics ? JSON.parse(repo.topics) : [],
          starredAt: repo.starredAt.toISOString(),
          pushedAt: repo.pushedAt?.toISOString() || null,
        }));
      }
    } else {
      // 精确搜索，使用SQL查询
      const repos = await db
        .select({
          id: repoTable.id,
          githubId: repoTable.githubId,
          name: repoTable.name,
          fullName: repoTable.fullName,
          owner: repoTable.owner,
          description: repoTable.description,
          language: repoTable.language,
          stargazersCount: repoTable.stargazersCount,
          topics: repoTable.topics,
          starredAt: repoTable.starredAt,
          license: repoTable.license,
          pushedAt: repoTable.pushedAt,
          archived: repoTable.archived,
          url: repoTable.url,
          readmeContent: repoTable.readmeContent,
        })
        .from(repoTable)
        .where(and(...conditions))
        .orderBy(sql`${repoTable.stargazersCount} DESC`)
        .limit(50); // 限制返回结果数量

      // 处理topics字段（从JSON字符串转换为数组）
      processedRepos = repos.map(repo => ({
        ...repo,
        topics: repo.topics ? JSON.parse(repo.topics) : [],
        starredAt: repo.starredAt.toISOString(),
        pushedAt: repo.pushedAt?.toISOString() || null,
      }));
    }

    return NextResponse.json({
      repos: processedRepos,
      total: processedRepos.length,
      query: query || undefined,
      isAiSearch,
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}