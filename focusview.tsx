"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Check,
  SkipForward,
  RefreshCw,
  Clock,
  Zap,
  Coffee,
  Moon,
  Play,
  Pause,
  ArrowLeft,
  CalendarClock,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, EnergyLevel } from "@/pages/Index"

interface FocusViewProps {
  task: Task | null
  energy: EnergyLevel
  onComplete: (notes?: string, actualDuration?: number) => void
  onSkip: () => void
  onChangeEnergy: () => void
  onStartFocus: () => void
  onReschedule: (task: Task) => void
  focusStartTime: Date | null
}

const energyIcons = {
  high: Zap,
  medium: Coffee,
  low: Moon,
}

const energyLabels = {
  high: "High Energy",
  medium: "Medium Energy",
  low: "Low Energy",
}

// Research-backed timer options:
// - 25min: Classic Pomodoro (matches short-term attention span)
// - 45min: Creative work blocks (optimal for moderate depth tasks)
// - 52min: DeskTime productivity study optimal interval
// - 90min: Ultradian rhythm deep work session (neurochemical peak)
const TIMER_OPTIONS = [
  { value: 25, label: "25 min", description: "Pomodoro sprint" },
  { value: 45, label: "45 min", description: "Creative block" },
  { value: 52, label: "52 min", description: "Optimal interval" },
  { value: 90, label: "90 min", description: "Deep work cycle" },
]

export function FocusView({
  task,
  energy,
  onComplete,
  onSkip,
  onChangeEnergy,
  onStartFocus,
  onReschedule,
  focusStartTime,
}: FocusViewProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [selectedTimer, setSelectedTimer] = useState<number>(task?.duration || 45)

  useEffect(() => {
    if (!focusStartTime || isPaused) return

    const interval = setInterval(() => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - focusStartTime.getTime()) / 1000)
      setElapsedSeconds(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [focusStartTime, isPaused])

  useEffect(() => {
    setElapsedSeconds(0)
    setIsPaused(false)
    setNotes("")
    setShowNotes(false)
    setSelectedTimer(task?.duration || 45)
  }, [task?.id, task?.duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const timerSeconds = selectedTimer * 60
  const progress = Math.min((elapsedSeconds / timerSeconds) * 100, 100)
  const isOvertime = elapsedSeconds > timerSeconds

  const EnergyIcon = energy ? energyIcons[energy] : Zap

  const handleComplete = () => {
    const actualMinutes = Math.ceil(elapsedSeconds / 60)
    onComplete(notes || undefined, actualMinutes > 0 ? actualMinutes : undefined)
  }

  if (!task) {
    return (
      <div className="py-16 text-center animate-fade-in">
        <Button variant="ghost" size="sm" onClick={onChangeEnergy} className="mb-6 text-muted-foreground">
          <ArrowLeft className="size-4 mr-1.5" />
          Back to energy selection
        </Button>
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="size-8 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-semibold mb-2">All caught up!</h2>
        <p className="text-muted-foreground mb-6">No tasks match your current energy level</p>
        <Button variant="outline" onClick={onChangeEnergy}>
          <RefreshCw className="size-4 mr-2" />
          Change energy level
        </Button>
      </div>
    )
  }

  return (
    <div className="py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onChangeEnergy} className="text-muted-foreground size-9">
            <ArrowLeft className="size-4" />
          </Button>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <EnergyIcon className="size-3.5" />
            {energy && energyLabels[energy]}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onChangeEnergy} className="text-muted-foreground">
          <RefreshCw className="size-4 mr-1.5" />
          Change
        </Button>
      </div>

      <Card className="border-2 border-primary/20 bg-card shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Focus on this</p>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4 text-balance leading-snug">{task.title}</h2>

            {!focusStartTime ? (
              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="size-4" />
                  <span>Select focus duration</span>
                </div>
                <Select value={selectedTimer.toString()} onValueChange={(v) => setSelectedTimer(Number(v))}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px] text-center">
                  Based on ultradian rhythms and cognitive research
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                <Clock className="size-4" />
                <span>Target: {selectedTimer} minutes</span>
              </div>
            )}

            {focusStartTime ? (
              <div className="mb-8">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={isOvertime ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 2.83} 283`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className={`text-4xl font-mono font-light tabular-nums ${isOvertime ? "text-destructive" : "text-primary"}`}
                    >
                      {formatTime(elapsedSeconds)}
                    </div>
                    {isOvertime && <span className="text-xs text-destructive mt-1">Overtime</span>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                  className="text-muted-foreground"
                >
                  {isPaused ? (
                    <>
                      <Play className="size-4 mr-1.5" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="size-4 mr-1.5" />
                      Pause
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button size="lg" variant="outline" onClick={onStartFocus} className="mb-8 bg-transparent">
                <Play className="size-4 mr-2" />
                Start Focus Timer
              </Button>
            )}

            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
                className="text-muted-foreground gap-1"
              >
                <FileText className="size-4" />
                Add notes (optional)
                {showNotes ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </Button>

              {showNotes && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jot down any thoughts, blockers, or progress notes..."
                    className="text-sm min-h-[80px] resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={handleComplete} className="gap-2 px-8">
                <Check className="size-5" />
                Done
              </Button>
              <Button size="lg" variant="outline" onClick={() => onReschedule(task)} className="gap-2">
                <CalendarClock className="size-5" />
                Reschedule
              </Button>
              <Button size="lg" variant="ghost" onClick={onSkip} className="gap-2 text-muted-foreground">
                <SkipForward className="size-5" />
                Not now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
