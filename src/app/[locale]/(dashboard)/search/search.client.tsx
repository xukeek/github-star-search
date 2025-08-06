"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { SearchFilters as SearchFiltersComponent } from "@/components/search/search-filters";
import { RepoCard } from "@/components/search/repo-card";
import { useTranslations } from "next-intl";

interface SearchClientProps {
  userId: string;
}

export interface SearchFilters {
  keyword?: string;
  language?: string;
  topics?: string[];
  stargazers_min?: number;
  stargazers_max?: number;
  owner?: string;
  starred_after?: string;
  starred_before?: string;
  license?: string;
  pushed_after?: string;
  pushed_before?: string;
  archived?: boolean;
}

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

export interface SearchResult {
  repos: Repository[];
  total: number;
  query?: string;
  isAiSearch?: boolean;
}

export function SearchClient({ }: SearchClientProps) {
  const t = useTranslations('search');

  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (isAiSearch = false) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const searchParams = new URLSearchParams();

      if (searchQuery.trim()) {
        searchParams.set("q", searchQuery.trim());
      }

      if (isAiSearch) {
        searchParams.set("ai", "true");
      }

      // 添加筛选条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            searchParams.set(key, value.join(","));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      const result = await response.json() as SearchResult & { error?: string };

      if (response.ok) {
        setSearchResults(result);
      } else {
        console.error("Search failed:", result.error);
        setSearchResults({ repos: [], total: 0 });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ repos: [], total: 0 });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filters]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 主搜索框 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4 py-3 text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleSearch(false)}
                disabled={isSearching}
                className="flex-1"
              >
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? t('searching') : t('normalSearch')}
              </Button>

              <Button
                onClick={() => handleSearch(true)}
                disabled={isSearching || !searchQuery.trim()}
                variant="default"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isSearching ? t('aiSearching') : t('aiSearch')}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {t('advanced')}
                {showAdvancedFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 高级筛选 */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('filters.title')}</CardTitle>
            <CardDescription>
              {t('filters.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={() => handleSearch(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* 搜索结果 */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {t('results.title')}
                {searchResults && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {t('results.count', { count: searchResults.total })}
                  </span>
                )}
              </CardTitle>
              {searchResults?.isAiSearch && (
                <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {t('results.aiPowered')}
                </Badge>
              )}
            </div>
            {searchResults?.query && (
              <CardDescription>
                {t('results.query', { query: searchResults.query })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{t('searching')}</p>
                </div>
              </div>
            ) : searchResults?.repos.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('results.noResults')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('results.noResultsDesc')}
                </p>
                <Button variant="outline" onClick={() => setShowAdvancedFilters(true)}>
                  <Filter className="mr-2 h-4 w-4" />
                  {t('results.modifyFilters')}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {searchResults?.repos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 空状态 - 首次访问 */}
      {!hasSearched && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('emptyState.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('emptyState.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{t('emptyState.aiExamples')}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {t.raw('emptyState.examples.ai').map((example: string, index: number) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{t('emptyState.preciseExamples')}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {t.raw('emptyState.examples.precise').map((example: string, index: number) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}