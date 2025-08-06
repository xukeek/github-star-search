"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  ExternalLink,
  Calendar,
  GitFork,
  Archive,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Repository {
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
}

interface RepoCardProps {
  repo: Repository;
  showAiIndicator?: boolean;
}

const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-500",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-orange-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-600",
  "C++": "bg-pink-500",
  "C#": "bg-purple-500",
  PHP: "bg-indigo-500",
  Ruby: "bg-red-500",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-600",
  Dart: "bg-blue-400",
  Shell: "bg-gray-500",
  HTML: "bg-orange-600",
  CSS: "bg-blue-600",
  Vue: "bg-green-400",
  React: "bg-cyan-400",
  Svelte: "bg-red-400",
};

export function RepoCard({ repo, showAiIndicator = false }: RepoCardProps) {
  const starredDate = new Date(repo.starredAt);
  const pushedDate = repo.pushedAt ? new Date(repo.pushedAt) : null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getLanguageColor = (language: string) => {
    return languageColors[language] || "bg-gray-500";
  };

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      {showAiIndicator && (
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Match
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg hover:text-blue-600 transition-colors">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <span className="truncate">{repo.fullName}</span>
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            </CardTitle>

            {repo.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {repo.description}
              </CardDescription>
            )}
          </div>

          {repo.archived && (
            <Badge variant="secondary" className="flex-shrink-0">
              <Archive className="mr-1 h-3 w-3" />
              Archived
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {repo.topics.slice(0, 5).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
            {repo.topics.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{repo.topics.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats and metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {/* Language */}
          {repo.language && (
            <div className="flex items-center gap-1">
              <div
                className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}
              />
              {repo.language}
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {formatNumber(repo.stargazersCount)}
          </div>

          {/* License */}
          {repo.license && (
            <div className="hidden sm:block">
              {repo.license}
            </div>
          )}

          {/* Starred date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Starred {formatDistanceToNow(starredDate, { addSuffix: true })}
          </div>
        </div>

        {/* Last updated */}
        {pushedDate && (
          <div className="text-xs text-muted-foreground mt-2">
            Last updated {formatDistanceToNow(pushedDate, { addSuffix: true })}
          </div>
        )}

        {/* Action button */}
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <GitFork className="h-3 w-3" />
              View on GitHub
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}