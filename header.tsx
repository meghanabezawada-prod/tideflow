"use client"

import { Button } from "@/components/ui/button"
import { Waves, BarChart3, Calendar, Home } from "lucide-react"

interface HeaderProps {
  completedToday: number
  onOpenReflection: () => void
  onOpenCalendar: () => void
  onGoHome: () => void
}

export function Header({ completedToday, onOpenReflection, onOpenCalendar, onGoHome }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Waves className="size-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl tracking-tight">Tideflow</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{completedToday}</span> completed today
          </div>
          <Button variant="ghost" size="sm" onClick={onGoHome} className="gap-2">
            <Home className="size-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenCalendar} className="gap-2">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenReflection} className="gap-2">
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">Reflect</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
