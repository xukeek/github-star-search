'use client';

import {
  StarIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  FunnelIcon,
  ClockIcon,
  CpuChipIcon,
  CodeBracketIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from 'next-intl';

export function Features() {
  const t = useTranslations('features');

  const features = [
    {
      name: t('items.aiSearch.title'),
      description: t('items.aiSearch.description'),
      icon: SparklesIcon,
    },
    {
      name: t('items.preciseFilter.title'),
      description: t('items.preciseFilter.description'),
      icon: FunnelIcon,
    },
    {
      name: t('items.hybridSearch.title'),
      description: t('items.hybridSearch.description'),
      icon: MagnifyingGlassIcon,
    },
    {
      name: t('items.autoSync.title'),
      description: t('items.autoSync.description'),
      icon: ClockIcon,
    },
    {
      name: t('items.fastResponse.title'),
      description: t('items.fastResponse.description'),
      icon: CpuChipIcon,
    },
    {
      name: t('items.zeroCost.title'),
      description: t('items.zeroCost.description'),
      icon: LightBulbIcon,
    },
    {
      name: t('items.openSource.title'),
      description: t('items.openSource.description'),
      icon: CodeBracketIcon,
    },
    {
      name: t('items.starManagement.title'),
      description: t('items.starManagement.description'),
      icon: StarIcon,
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            {t('title')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('subtitle')}
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon
                    className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
