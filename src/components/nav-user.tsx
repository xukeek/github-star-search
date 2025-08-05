"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSessionStore } from "@/state/session"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useServerAction } from "zsa-react"
import { signOutAction } from "@/actions/sign-out.action"
import { toast } from "sonner"

export function NavUser() {
  const { session, isLoading } = useSessionStore();
  const router = useRouter()
  const { execute: signOut } = useServerAction(signOutAction, {
    onSuccess: () => {
      toast.success("Signed out successfully")
      router.push('/')
    },
    onError: (error) => {
      toast.error(error.err?.message)
    }
  })

  if (isLoading || !session?.user) {
    return null;
  }

  const { user } = session;
  const displayName = user.name ?? user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src={user.avatar ?? ''} alt={displayName ?? ''} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({})}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
