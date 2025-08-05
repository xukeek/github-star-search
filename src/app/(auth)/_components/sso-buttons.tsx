import { Button } from "@/components/ui/button"
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function SSOButtons({
  isSignIn = false
}: {
  isSignIn?: boolean
}) {

  return (
    <>
      <Button className="w-full" asChild size='lg'>
        <Link href="/sso/github">
          <FaGithub className="w-[22px] h-[22px] mr-2" />
          {isSignIn ? "Sign in with GitHub" : "Sign up with GitHub"}
        </Link>
      </Button>
    </>
  )
}
