"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from 'next-intl'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ThemeSwitchProps {
  children?: React.ReactNode
  className?: string
}

export default function ThemeSwitch({ children, className }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('theme')

  const themes = [
    { key: 'system', label: t('system'), icon: Monitor },
    { key: 'light', label: t('light'), icon: Sun },
    { key: 'dark', label: t('dark'), icon: Moon },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`h-8 w-8 px-0 ${className}`}>
          <div className="relative flex items-center">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          {children && <span className="ml-2">{children}</span>}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.map(({ key, label, icon: Icon }) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key)}
            className={`cursor-pointer ${theme === key ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <span className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              {theme === key && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
