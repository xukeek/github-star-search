'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import ThemeSwitch from '@/components/theme-switch';
import { SITE_NAME } from '@/constants';
import { Github, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const t = useTranslations('navigation');
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
        <Button variant="ghost" size="sm" className="w-full justify-start md:w-auto md:justify-center">
          {t('dashboard')}
        </Button>
      </Link>
      <Link href="/sign-in" onClick={() => setIsOpen(false)}>
        <Button variant="outline" size="sm" className="w-full justify-start md:w-auto md:justify-center">
          {t('signin')}
        </Button>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 mr-6">
              <Github className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                {SITE_NAME}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <NavItems />
            </nav>
            <div className="flex items-center space-x-2 pl-4 border-l border-border/40">
              <LanguageSwitcher />
              <ThemeSwitch />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher />
            <ThemeSwitch />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Github className="h-6 w-6" />
                    <span className="font-bold">{SITE_NAME}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="flex flex-col space-y-3">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}