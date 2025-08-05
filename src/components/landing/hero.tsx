'use client';

import { Button } from "@/components/ui/button";
import { GITHUB_REPO_URL } from "@/constants";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StarIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <div className="relative isolate pt-14 dark:bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="pt-20 pb-24 sm:pt-20 sm:pb-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-10 flex justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <StarIcon className="w-3 h-3 mr-1" />
                {t('badge1')}
              </Badge>
              <Badge variant="secondary" className="rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <SparklesIcon className="w-3 h-3 mr-1" />
                {t('badge2')}
              </Badge>
            </div>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
            <p className="mt-2 text-xl font-medium text-muted-foreground">
              {t('subtitle')}
            </p>

            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-4 md:gap-x-6">
              <Link href="/sign-in">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                  {t('cta.primary')}
                </Button>
              </Link>
              <a href={GITHUB_REPO_URL} target="_blank">
                <Button variant="outline" size="lg" className="rounded-full">
                  <StarIcon className="w-4 h-4 mr-2" />
                  {t('cta.secondary')}
                </Button>
              </a>
            </div>

            {/* Demo preview */}
            <div className="mt-16">
              <div className="relative mx-auto max-w-lg">
                <div className="relative rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">{t('demo.title')}</div>
                  </div>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('demo.placeholder')}
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-sm"
                      readOnly
                    />
                    <SparklesIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground text-center">
                    {t('demo.example')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


