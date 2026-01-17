"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  X,
  Zap,
  Coffee,
  Moon,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  FileText,
  CalendarClock,
} from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { Task } from "@/pages/Index"
import { generateInsights, getTimerData } from "@/lib/analytics"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ReflectionPanelProps {
  tasks: Task[]
  tasksByDate: Record<string, Task[]>
  onClose: () => void
}

export function ReflectionPanel({ tasks, tasksByDate, onClose }: ReflectionPanelProps) {
  const completedTasks = tasks.filter((t) => t.completed)
  const totalMinutes = completedTasks.reduce((acc, t) => acc + (t.actualDuration || t.duration), 0)

  const byEnergy = {
    high: completedTasks.filter((t) => t.energy === "high").length,
    medium: completedTasks.filter((t) => t.energy === "medium").length,
    low: completedTasks.filter((t) => t.energy === "low").length,
  }

  const energyConfig = {
    high: { icon: Zap, label: "High energy", color: "text-chart-1", bg: "bg-chart-1" },
    medium: { icon: Coffee, label: "Medium energy", color: "text-chart-2", bg: "bg-chart-2" },
    low: { icon: Moon, label: "Low energy", color: "text-chart-3", bg: "bg-chart-3" },
  }

  const maxCount = Math.max(byEnergy.high, byEnergy.medium, byEnergy.low, 1)

  const timerData = getTimerData(tasksByDate)
  const { insights, suggestions } = generateInsights(tasksByDate, tasks[0]?.scheduledDate || "")

  const rescheduledTasks = tasks.filter((t) => t.rescheduledTo)

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-200">
      <div className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl overflow-auto">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-serif">Daily Reflection & Insights</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>

          <CardContent className="flex-1 space-y-8 overflow-auto pb-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="text-4xl font-serif font-semibold text-primary mb-1">{completedTasks.length}</div>
                <div className="text-sm text-muted-foreground">Tasks completed</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted">
                <div className="text-4xl font-serif font-semibold mb-1">{Math.round((totalMinutes / 60) * 10) / 10}h</div>
                <div className="text-sm text-muted-foreground">Time focused</div>
              </div>
            </div>

            {/* Energy Distribution */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                Energy Distribution
              </h3>
              <div className="space-y-3">
                {(Object.keys(energyConfig) as Array<keyof typeof energyConfig>).map((energy) => {
                  const config = energyConfig[energy]
                  const Icon = config.icon
                  const count = byEnergy[energy]
                  const percentage = (count / maxCount) * 100

                  return (
                    <div key={energy} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Icon className={`size-4 ${config.color}`} />
                          {config.label}
                        </span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${config.bg} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {timerData.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                  Weekly Focus Time (Planned vs Actual)
                </h3>
                <ChartContainer
                  config={{
                    planned: { label: "Planned", color: "hsl(var(--chart-1))" },
                    actual: { label: "Actual", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timerData}>
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}m`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="planned" fill="var(--color-planned)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}

            {(insights.length > 0 || suggestions.length > 0) && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                  AI Insights & Suggestions
                </h3>
                <div className="space-y-3">
                  {insights.map((insight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <Lightbulb className="size-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{insight}</span>
                    </div>
                  ))}
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        suggestion.type === "warning"
                          ? "bg-chart-2/10 border border-chart-2/20"
                          : suggestion.type === "success"
                            ? "bg-chart-3/10 border border-chart-3/20"
                            : "bg-muted"
                      }`}
                    >
                      {suggestion.type === "warning" ? (
                        <AlertTriangle className="size-4 text-chart-2 mt-0.5 shrink-0" />
                      ) : (
                        <TrendingUp className="size-4 text-chart-3 mt-0.5 shrink-0" />
                      )}
                      <span className="text-sm">{suggestion.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                  Completed Today
                </h3>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                        <span className="text-sm font-medium">{task.title}</span>
                      </div>
                      {task.notes && (
                        <div className="mt-2 ml-7 flex items-start gap-2 text-xs text-muted-foreground">
                          <FileText className="size-3 mt-0.5 shrink-0" />
                          <span className="italic">{task.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rescheduledTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Rescheduled</h3>
                <div className="space-y-2">
                  {rescheduledTasks.map((task) => (
                    <div key={task.id} className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/10">
                      <div className="flex items-center gap-3">
                        <CalendarClock className="size-4 text-chart-2 shrink-0" />
                        <span className="text-sm">{task.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          →{" "}
                          {new Date(task.rescheduledTo!).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {task.notes && (
                        <div className="mt-2 ml-7 flex items-start gap-2 text-xs text-muted-foreground">
                          <FileText className="size-3 mt-0.5 shrink-0" />
                          <span className="italic">{task.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks completed yet. Take your time — quality over quantity.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
