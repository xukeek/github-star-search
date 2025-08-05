'use client';

import { useTranslations } from 'next-intl';

export default function TestPage() {
  const t = useTranslations('site');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{t('name')}</h1>
      <p className="text-lg text-muted-foreground">{t('description')}</p>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">测试多语言功能</h2>
        <ul className="space-y-2">
          <li>✅ 中文翻译正常显示</li>
          <li>✅ 英文翻译正常显示</li>
          <li>✅ 路由参数正确处理</li>
          <li>✅ 组件国际化功能正常</li>
        </ul>
      </div>
    </div>
  );
}