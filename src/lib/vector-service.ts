import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

// 扩展Repository接口以包含userId
export interface RepositoryWithUser {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  language: string | null;
  stargazersCount: number;
  topics: string[];
  starredAt: string;
  license: string | null;
  pushedAt: string | null;
  archived: boolean;
  url: string;
  readmeContent: string | null;
  userId: string;
}

export interface VectorDocument {
  id: string;
  values: number[];
  metadata: {
    userId: string;
    githubId: number;
    name: string;
    fullName: string;
    owner: string;
    description?: string;
    language?: string;
    stargazersCount: number;
    topics: string[];
    starredAt: string;
    license?: string;
    url: string;
  };
}

export class VectorService {
  private async getBindings() {
    const { env } = await getCloudflareContext();
    return {
      vectorize: env.VECTORIZE_INDEX,
      ai: env.AI,
    };
  }

  async embedText(text: string): Promise<number[]> {
    const { ai } = await this.getBindings();

    try {
      const response = await ai.run("@cf/baai/bge-base-en-v1.5", {
        text: [text]
      }) as { data: number[][] };

      return response.data[0];
    } catch (error) {
      console.error("Failed to embed text:", error);
      throw new Error("Text embedding failed");
    }
  }

  private prepareTextForEmbedding(repo: RepositoryWithUser): string {
    // 组合仓库的关键信息用于向量化
    const parts = [
      repo.name,
      repo.description || "",
      repo.language || "",
      ...repo.topics,
      repo.owner,
      // 只取README的前1000个字符避免超过token限制
      repo.readmeContent ? repo.readmeContent.substring(0, 1000) : "",
    ].filter(Boolean);

    return parts.join(" ");
  }

  async vectorizeRepository(repo: RepositoryWithUser): Promise<void> {
    const { vectorize } = await this.getBindings();

    const text = this.prepareTextForEmbedding(repo);
    const embedding = await this.embedText(text);

    const vectorDoc: VectorDocument = {
      id: `repo_${repo.userId}_${repo.githubId}`,
      values: embedding,
      metadata: {
        userId: repo.userId,
        githubId: repo.githubId,
        name: repo.name,
        fullName: repo.fullName,
        owner: repo.owner,
        description: repo.description || undefined,
        language: repo.language || undefined,
        stargazersCount: repo.stargazersCount,
        topics: repo.topics,
        starredAt: repo.starredAt,
        license: repo.license || undefined,
        url: repo.url,
      },
    };

    await vectorize.upsert([vectorDoc]);
  }

  async vectorizeBatch(repos: RepositoryWithUser[]): Promise<{ success: number; errors: string[] }> {
    const { vectorize } = await this.getBindings();
    const errors: string[] = [];
    let success = 0;

    // 处理批量向量化，每次最多处理20个
    const batchSize = 20;
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize);

      try {
        const vectorDocs: VectorDocument[] = [];

        for (const repo of batch) {
          try {
            const text = this.prepareTextForEmbedding(repo);
            const embedding = await this.embedText(text);

            vectorDocs.push({
              id: `repo_${repo.userId}_${repo.githubId}`,
              values: embedding,
              metadata: {
                userId: repo.userId,
                githubId: repo.githubId,
                name: repo.name,
                fullName: repo.fullName,
                owner: repo.owner,
                description: repo.description || undefined,
                language: repo.language || undefined,
                stargazersCount: repo.stargazersCount,
                topics: repo.topics,
                starredAt: repo.starredAt,
                license: repo.license || undefined,
                url: repo.url,
              },
            });
          } catch (error) {
            errors.push(`Failed to vectorize ${repo.fullName}: ${error}`);
            continue;
          }
        }

        if (vectorDocs.length > 0) {
          await vectorize.upsert(vectorDocs);
          success += vectorDocs.length;
        }

      } catch (error) {
        errors.push(`Batch upsert failed: ${error}`);
      }
    }

    return { success, errors };
  }

  async searchSimilar(
    query: string,
    userId: string,
    limit = 50
  ): Promise<{ repos: RepositoryWithUser[]; scores: number[] }> {
    const { vectorize } = await this.getBindings();

    // 将查询文本向量化
    const queryEmbedding = await this.embedText(query);

    // 在向量数据库中搜索
    const results = await vectorize.query(queryEmbedding, {
      topK: limit,
      filter: { userId }, // 只搜索当前用户的仓库
      returnMetadata: "all",
    });

    const repos = results.matches.map(match => {
      const metadata = match.metadata as VectorDocument['metadata'];
      return {
        id: `repo_${metadata.userId}_${metadata.githubId}`,
        githubId: metadata.githubId,
        name: metadata.name,
        fullName: metadata.fullName,
        owner: metadata.owner,
        description: metadata.description || null,
        language: metadata.language || null,
        stargazersCount: metadata.stargazersCount,
        topics: metadata.topics || [],
        starredAt: metadata.starredAt,
        license: metadata.license || null,
        pushedAt: null, // 这个字段不在向量存储中
        archived: false, // 这个字段不在向量存储中
        url: metadata.url,
        readmeContent: null, // 不返回完整的README内容
        userId: metadata.userId,
      };
    });

    const scores = results.matches.map(match => match.score);

    return { repos, scores };
  }

  async deleteRepository(userId: string, githubId: number): Promise<void> {
    const { vectorize } = await this.getBindings();
    const id = `repo_${userId}_${githubId}`;

    try {
      await vectorize.deleteByIds([id]);
    } catch (error) {
      console.error(`Failed to delete vector for repo ${githubId}:`, error);
      // 不抛出错误，因为向量删除失败不应该阻止其他操作
    }
  }
}