"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Zap,
  Coffee,
  Moon,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  Clock,
  ChevronRight,
  Pencil,
  X,
  CalendarDays,
} from "lucide-react"
import { analyzeTask } from "@/lib/task-analyzer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AnalyzedTask = {
  id: string
  title: string
  energy: "high" | "medium" | "low"
  priority: "urgent" | "important" | "normal"
  estimatedDuration: number
  reasoning: string
}

interface TaskIntakeProps {
  onComplete: (tasks: Array<{ title: string; energy: "high" | "medium" | "low"; duration: number }>) => void
  onSkip: () => void
  selectedDate: Date
}

const energyConfig = {
  high: { icon: Zap, label: "High Energy", color: "bg-chart-1/10 text-chart-1 border-chart-1/20" },
  medium: { icon: Coffee, label: "Medium Energy", color: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
  low: { icon: Moon, label: "Low Energy", color: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
}

// Research-backed duration options:
// 15min - Quick dispatch (Cal Newport)
// 25min - Pomodoro Technique
// 45min - Academic focus block
// 52min - DeskTime optimal work interval
// 90min - Ultradian rhythm deep work
// 120min - Extended deep work session
const DURATION_OPTIONS = [15, 25, 45, 52, 90, 120]

export function TaskIntake({ onComplete, onSkip, selectedDate }: TaskIntakeProps) {
  const [step, setStep] = useState<"input" | "review">("input")
  const [rawInput, setRawInput] = useState("")
  const [analyzedTasks, setAnalyzedTasks] = useState<AnalyzedTask[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAnalyze = () => {
    const lines = rawInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (lines.length === 0) return

    const analyzed = lines.map((title, index) => {
      const analysis = analyzeTask(title)
      return {
        id: `task-${index}-${Date.now()}`,
        title,
        ...analysis,
      }
    })

    setAnalyzedTasks(analyzed)
    setStep("review")
  }

  const handleUpdateTask = (id: string, updates: Partial<AnalyzedTask>) => {
    setAnalyzedTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
    setEditingId(null)
  }

  const handleRemoveTask = (id: string) => {
    setAnalyzedTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleConfirm = () => {
    const tasks = analyzedTasks.map((t) => ({
      title: t.title,
      energy: t.energy,
      duration: t.estimatedDuration,
    }))
    onComplete(tasks)
  }

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  const formatDuration = (mins: number): string => {
    if (mins < 60) return `${mins} min`
    if (mins === 60) return "1 hour"
    if (mins === 90) return "1.5 hours"
    if (mins === 120) return "2 hours"
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  if (step === "input") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="size-4" />
            Smart Task Intake
          </div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight">What's on your mind?</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            List your tasks below — one per line. I'll analyze them and match each to the right energy level for you.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border text-sm font-medium">
            <CalendarDays className="size-4 text-muted-foreground" />
            <span>{isToday ? "Today" : formattedDate}</span>
            {isToday && <span className="text-muted-foreground">· {formattedDate}</span>}
          </div>
        </div>

        <Card className="border-2 border-dashed">
          <CardContent className="p-6">
            <Textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder={`Example tasks for a Delivery Manager:\n\nFacilitate sprint planning session\nReview and approve timesheets\nPrepare agenda for standup\nHave 1:1 with team member about performance\nUpdate project status in Jira\nNegotiate timeline with stakeholder`}
              className="min-h-[200px] text-base resize-none border-0 shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/50"
              autoFocus
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
            Skip for now
          </Button>
          <Button onClick={handleAnalyze} disabled={!rawInput.trim()} className="gap-2">
            Analyze Tasks
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4">
          {Object.entries(energyConfig).map(([key, config]) => {
            const Icon = config.icon
            return (
              <div key={key} className={`p-3 rounded-lg border ${config.color} text-center`}>
                <Icon className="size-5 mx-auto mb-1" />
                <div className="text-xs font-medium">{config.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/10 text-chart-3 text-sm font-medium">
          <Check className="size-4" />
          Analysis Complete
        </div>
        <h1 className="text-3xl font-serif font-semibold tracking-tight">Review Your Tasks</h1>
        <p className="text-muted-foreground">
          I've categorized {analyzedTasks.length} tasks. Adjust any that don't feel right.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border text-sm font-medium">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span>Scheduling for {isToday ? "Today" : formattedDate}</span>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {analyzedTasks.map((task) => {
          const config = energyConfig[task.energy]
          const Icon = config.icon
          const isEditing = editingId === task.id

          return (
            <Card key={task.id} className={`transition-all ${isEditing ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="font-medium">{task.title}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Energy Level</label>
                        <Select
                          value={task.energy}
                          onValueChange={(v) => handleUpdateTask(task.id, { energy: v as typeof task.energy })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">
                              <span className="flex items-center gap-2">
                                <Zap className="size-3" /> High Energy
                              </span>
                            </SelectItem>
                            <SelectItem value="medium">
                              <span className="flex items-center gap-2">
                                <Coffee className="size-3" /> Medium Energy
                              </span>
                            </SelectItem>
                            <SelectItem value="low">
                              <span className="flex items-center gap-2">
                                <Moon className="size-3" /> Low Energy
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Duration</label>
                        <Select
                          value={task.estimatedDuration.toString()}
                          onValueChange={(v) => handleUpdateTask(task.id, { estimatedDuration: Number.parseInt(v) })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DURATION_OPTIONS.map((mins) => (
                              <SelectItem key={mins} value={mins.toString()}>
                                {formatDuration(mins)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setEditingId(null)}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${config.color} shrink-0`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{formatDuration(task.estimatedDuration)}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{task.reasoning}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingId(task.id)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={() => setStep("input")}>
          Back to edit
        </Button>
        <Button onClick={handleConfirm} className="gap-2">
          Start Focusing
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
