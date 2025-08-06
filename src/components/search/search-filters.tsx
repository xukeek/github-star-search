"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

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

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

const COMMON_LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby",
  "Swift", "Kotlin", "Dart", "Shell", "HTML", "CSS", "Vue", "React", "Svelte"
];

const COMMON_LICENSES = [
  "MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "BSD-2-Clause", "ISC", "LGPL-2.1", "GPL-2.0"
];

export function SearchFilters({ filters, onFiltersChange, onSearch }: SearchFiltersProps) {
  const t = useTranslations('search.filters');
  const [newTopic, setNewTopic] = useState("");

  const updateFilter = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const addTopic = () => {
    if (newTopic.trim() && !filters.topics?.includes(newTopic.trim())) {
      updateFilter("topics", [...(filters.topics || []), newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    updateFilter("topics", filters.topics?.filter(t => t !== topic));
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 关键词搜索 */}
        <div className="space-y-2">
          <Label htmlFor="keyword">{t('keyword')}</Label>
          <Input
            id="keyword"
            value={filters.keyword || ""}
            onChange={(e) => updateFilter("keyword", e.target.value)}
            placeholder={t('placeholders.keyword')}
          />
        </div>

        {/* 编程语言 */}
        <div className="space-y-2">
          <Label htmlFor="language">{t('language')}</Label>
          <Select
            value={filters.language || ""}
            onValueChange={(value) => updateFilter("language", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('placeholders.language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {COMMON_LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 所有者/组织 */}
        <div className="space-y-2">
          <Label htmlFor="owner">{t('owner')}</Label>
          <Input
            id="owner"
            value={filters.owner || ""}
            onChange={(e) => updateFilter("owner", e.target.value)}
            placeholder={t('placeholders.owner')}
          />
        </div>
      </div>

      {/* 主题标签 */}
      <div className="space-y-2">
        <Label>{t('topics')}</Label>
        <div className="flex gap-2">
          <Input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder={t('placeholders.topics')}
            onKeyPress={(e) => e.key === "Enter" && addTopic()}
          />
          <Button onClick={addTopic} variant="outline" size="sm">
            Add
          </Button>
        </div>
        {filters.topics && filters.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                {topic}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTopic(topic)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Star 数范围 */}
      <div className="space-y-2">
        <Label>{t('stargazers')}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={filters.stargazers_min || ""}
            onChange={(e) => updateFilter("stargazers_min", e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder={t('ranges.min')}
          />
          <Input
            type="number"
            value={filters.stargazers_max || ""}
            onChange={(e) => updateFilter("stargazers_max", e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder={t('ranges.max')}
          />
        </div>
      </div>

      {/* 收藏时间范围 */}
      <div className="space-y-2">
        <Label>{t('starredDate')}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={filters.starred_after || ""}
            onChange={(e) => updateFilter("starred_after", e.target.value)}
            placeholder={t('ranges.from')}
          />
          <Input
            type="date"
            value={filters.starred_before || ""}
            onChange={(e) => updateFilter("starred_before", e.target.value)}
            placeholder={t('ranges.to')}
          />
        </div>
      </div>

      {/* 最后更新时间范围 */}
      <div className="space-y-2">
        <Label>{t('lastUpdate')}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={filters.pushed_after || ""}
            onChange={(e) => updateFilter("pushed_after", e.target.value)}
            placeholder={t('ranges.from')}
          />
          <Input
            type="date"
            value={filters.pushed_before || ""}
            onChange={(e) => updateFilter("pushed_before", e.target.value)}
            placeholder={t('ranges.to')}
          />
        </div>
      </div>

      {/* 许可证 */}
      <div className="space-y-2">
        <Label htmlFor="license">{t('license')}</Label>
        <Select
          value={filters.license || ""}
          onValueChange={(value) => updateFilter("license", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('placeholders.license')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Licenses</SelectItem>
            {COMMON_LICENSES.map((license) => (
              <SelectItem key={license} value={license}>
                {license}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 归档状态 */}
      <div className="space-y-2">
        <Label>{t('archived')}</Label>
        <Select
          value={filters.archived === undefined ? "all" : filters.archived.toString()}
          onValueChange={(value) =>
            updateFilter("archived", value === "all" ? undefined : value === "true")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="false">Not Archived</SelectItem>
            <SelectItem value="true">Archived Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button onClick={onSearch} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={clearAllFilters} variant="outline" className="flex-1">
          Clear All
        </Button>
      </div>
    </div>
  );
}