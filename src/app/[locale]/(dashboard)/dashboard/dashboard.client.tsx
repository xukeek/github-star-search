"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, RefreshCw, Clock, Database, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

interface SyncData {
  lastSyncTime: string | null;
  repoCount: number;
  needsInitialSync: boolean;
}

interface DashboardClientProps {
  user: User;
  initialSyncData: SyncData;
}

export function DashboardClient({ user, initialSyncData }: DashboardClientProps) {
  const t = useTranslations('dashboard');

  const [syncData, setSyncData] = useState(initialSyncData);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
      });

      const result = await response.json() as { message?: string; error?: string; synced?: number };

      if (response.ok) {
        toast.success(t('sync.syncSuccess', { count: result.synced || 0 }));

        // 刷新同步数据
        const statusResponse = await fetch("/api/sync");
        const statusData = await statusResponse.json() as SyncData;
        setSyncData(statusData);

      } else {
        throw new Error(result.error || "Sync failed");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error(t('sync.syncError'));
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('sync.never');
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user.name ? `欢迎回来，${user.name}!` : '欢迎使用星海AI领航员!'}
            </h1>
            <p className="text-muted-foreground">
              管理和搜索你的GitHub星标仓库
            </p>
          </div>
        </div>
      </div>

      {/* 同步状态卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            {t('sync.title')}
          </CardTitle>
          <CardDescription>
            查看和管理你的GitHub仓库同步状态
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {t('sync.lastSync')}
              </div>
              <div className="font-medium">
                {formatDate(syncData.lastSyncTime)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                {t('sync.repoCount')}
              </div>
              <div className="font-medium">
                {t('sync.repos', { count: syncData.repoCount })}
              </div>
            </div>
          </div>

          {syncData.needsInitialSync && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                {t('sync.needsInitialSync')}
              </span>
            </div>
          )}

          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full"
            size="lg"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? t('sync.syncing') : t('sync.triggerSync')}
          </Button>
        </CardContent>
      </Card>

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions.title')}</CardTitle>
          <CardDescription>
            快速访问常用功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild className="h-20 flex-col gap-2">
              <Link href="/search">
                <Star className="h-6 w-6" />
                <span>{t('quickActions.searchRepos')}</span>
              </Link>
            </Button>

            <Button variant="outline" disabled className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>{t('quickActions.viewAll')}</span>
              <Badge variant="secondary" className="text-xs">
                即将推出
              </Badge>
            </Button>

            <Button
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing}
              className="h-20 flex-col gap-2"
            >
              <RefreshCw className={`h-6 w-6 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{t('quickActions.syncNow')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('stats.title')}</CardTitle>
          <CardDescription>
            你的GitHub仓库数据概览
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {syncData.repoCount}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.totalRepos')}
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                --
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.languages')}
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                --
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.totalStars')}
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                --
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.lastActivity')}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Badge variant="outline">
              详细统计功能即将推出
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}