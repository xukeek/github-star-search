import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Github, ExternalLink } from 'lucide-react';
import ThemeSwitch from "@/components/theme-switch";
import { GITHUB_REPO_URL, SITE_NAME } from "@/constants";
import { Button } from "./ui/button";

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t bg-muted/30">
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Github className="h-5 w-5" />
                <span className="font-semibold">{SITE_NAME}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('description')}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-sm font-semibold">{t('features.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-muted-foreground">{t('features.aiSearch')}</span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">{t('features.preciseFilter')}</span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">{t('features.hybridSearch')}</span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">{t('features.autoSync')}</span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-sm font-semibold">{t('resources.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                    {t('resources.dashboard')}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 justify-center md:justify-start"
                  >
                    {t('resources.github')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    {t('resources.privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    {t('resources.terms')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social & Tools */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-sm font-semibold">{t('tools.title')}</h3>
              <div className="flex flex-col space-y-3 items-center md:items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{t('tools.themeSwitch')}</span>
                  <ThemeSwitch />
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={GITHUB_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2"
                    >
                      <Github className="h-4 w-4" />
                      <span>{t('tools.starOnGithub')}</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} {SITE_NAME}. {t('copyright')}
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4">
                <a
                  href="https://github.com/LubomirGeorgiev/cloudflare-workers-nextjs-saas-template"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  {t('originalTemplate')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
