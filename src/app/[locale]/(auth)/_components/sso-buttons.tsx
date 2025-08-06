import { Button } from "@/components/ui/button"
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useTranslations } from 'next-intl';

export default function SSOButtons() {
  const t = useTranslations('auth.signIn');

  return (
    <>
      <Button className="w-full" asChild size='lg'>
        <Link href="/sso/github">
          <FaGithub className="w-[22px] h-[22px] mr-2" />
          {t('githubButton')}
        </Link>
      </Button>
    </>
  )
}
