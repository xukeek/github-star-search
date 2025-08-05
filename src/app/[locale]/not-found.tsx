'use client';

import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-600 mb-4">{t('description')}</p>
        <a href="/" className="text-blue-600 hover:text-blue-800 underline">
          {t('returnHome')}
        </a>
      </div>
    </div>
  );
}
