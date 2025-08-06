"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Star, Sparkles, Search, Database } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function SignInClient() {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('auth.signIn');
  const heroT = useTranslations('hero');

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      window.location.href = "/sso/github";
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* 左侧：品牌介绍 */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge variant="outline" className="inline-flex items-center gap-2">
                <Star className="h-3 w-3" />
                {heroT('badge1')}
              </Badge>

              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {heroT('title')}
              </h1>

              <div className="text-lg text-muted-foreground font-medium">
                {heroT('subtitle')}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {heroT('description')}
              </p>
            </div>

            {/* 功能亮点 */}
            <div className="grid gap-4 text-left">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">AI 智能搜索</h3>
                  <p className="text-sm text-muted-foreground">通过自然语言描述找到任何仓库</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium">精确筛选</h3>
                  <p className="text-sm text-muted-foreground">按语言、Star数、时间等条件筛选</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">自动同步</h3>
                  <p className="text-sm text-muted-foreground">实时同步你的GitHub Stars</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：登录卡片 */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="border-2">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Github className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('title')}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {t('subtitle')}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  onClick={handleGitHubSignIn}
                  disabled={isLoading}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  <Github className="mr-2 h-5 w-5" />
                  {isLoading ? "连接中..." : t('githubButton')}
                </Button>

                <div className="space-y-4 text-sm">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">{t('features.title')}</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• {t('features.sync')}</li>
                      <li>• {t('features.search')}</li>
                      <li>• {t('features.manage')}</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">{t('benefits.title')}</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• {t('benefits.secure')}</li>
                      <li>• {t('benefits.free')}</li>
                      <li>• {t('benefits.fast')}</li>
                      <li>• {t('benefits.smart')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
