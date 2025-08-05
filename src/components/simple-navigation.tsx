"use client"

import Link from "next/link"
import { useSessionStore } from "@/state/session"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SITE_NAME } from "@/constants"

export function SimpleNavigation() {
  const { session, isLoading } = useSessionStore()

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">{SITE_NAME}</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoading ? (
            <Skeleton className="h-10 w-[80px]" />
          ) : !session ? (
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}