import withBundleAnalyzer from '@next/bundle-analyzer';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import createNextIntlPlugin from 'next-intl/plugin';

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
initOpenNextCloudflareForDev();

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

// TODO cache-control headers don't work for static files
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINTER === 'true'
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINTER === 'true'
  }
};

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer()(withNextIntl(nextConfig))
  : withNextIntl(nextConfig);
