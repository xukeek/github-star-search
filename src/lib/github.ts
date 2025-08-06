import "server-only";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  html_url: string;
  license: {
    key: string;
    name: string;
  } | null;
  pushed_at: string | null;
  archived: boolean;
}

export interface GitHubStarredRepo extends GitHubRepo {
  starred_at: string;
}

export class GitHubClient {
  private accessToken: string;
  private baseUrl = 'https://api.github.com';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, headers: Record<string, string> = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Starry-AI-Navigator/1.0',
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async getStarredRepos(page = 1, perPage = 100): Promise<GitHubStarredRepo[]> {
    // 使用特殊的Accept头来获取starred_at字段
    const response = await this.makeRequest(
      `/user/starred?page=${page}&per_page=${perPage}&sort=created&direction=desc`,
      {
        'Accept': 'application/vnd.github.star+json', // 这个header很重要，用于获取starred_at
      }
    );

    return response.json();
  }

  async getAllStarredRepos(): Promise<GitHubStarredRepo[]> {
    const allRepos: GitHubStarredRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const repos = await this.getStarredRepos(page, perPage);

      if (repos.length === 0) {
        break;
      }

      allRepos.push(...repos);

      // 如果返回的仓库数量少于perPage，说明已经是最后一页
      if (repos.length < perPage) {
        break;
      }

      page++;
    }

    return allRepos;
  }

  async getRepoReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await this.makeRequest(`/repos/${owner}/${repo}/readme`, {
        'Accept': 'application/vnd.github.raw', // 获取原始内容
      });

      return await response.text();
    } catch {
      // 如果仓库没有README，返回null
      console.log(`No README found for ${owner}/${repo}`);
      return null;
    }
  }
}