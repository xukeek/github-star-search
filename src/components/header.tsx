"use client";

import { NavUser } from './nav-user';
import { LanguageSwitcher } from './language-switcher';
import ThemeSwitch from './theme-switch';
import { Star, Search, BarChart3 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('navigation');
  const siteT = useTranslations('site');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* 左侧：Logo和主导航 */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Star className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {siteT('tagline')}
                </div>
                <div className="text-xs text-muted-foreground -mt-1">
                  {siteT('name')}
                </div>
              </div>
            </Link>

            {/* 主导航 */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('dashboard')}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {t('search')}
                </Link>
              </Button>
            </nav>
          </div>

          {/* 右侧：用户区域和设置 */}
          <div className="flex items-center space-x-4">
            {/* 设置区域 */}
            <div className="hidden sm:flex items-center space-x-2">
              <LanguageSwitcher />
              <ThemeSwitch />
            </div>

            {/* 分隔线 */}
            <div className="hidden sm:block h-6 w-px bg-border" />

            {/* 用户菜单 */}
            <NavUser />
          </div>
        </div>
      </div>
    </header>
  );
}
