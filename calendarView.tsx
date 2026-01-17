"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, X, Calendar, CheckCircle2, Clock, Zap, Coffee, Moon, FileText } from "lucide-react"
import { formatDate, getDaysInMonth, getMonthName, isSameDay } from "@/lib/task-storage"
import type { Task } from "@/pages/Index"

interface CalendarViewProps {
  tasksByDate: Record<string, Task[]>
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onClose: () => void
}

const energyIcons = {
  high: Zap,
  medium: Coffee,
  low: Moon,
}

const energyColors = {
  high: "text-chart-1",
  medium: "text-chart-2",
  low: "text-chart-3",
}

export function CalendarView({ tasksByDate, selectedDate, onSelectDate, onClose }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const days = getDaysInMonth(year, month)
  const today = new Date()

  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const getTasksForDate = (date: Date): Task[] => {
    return tasksByDate[formatDate(date)] || []
  }

  const selectedDateTasks = getTasksForDate(selectedDate)
  const completedTasks = selectedDateTasks.filter((t) => t.completed)
  const pendingTasks = selectedDateTasks.filter((t) => !t.completed)

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-200">
      <div className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl overflow-auto">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <CardTitle className="text-xl font-serif">Task Calendar</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>

          <CardContent className="flex-1 space-y-6 overflow-auto">
            {/* Calendar Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="size-5" />
                </Button>
                <h3 className="font-semibold text-lg">
                  {getMonthName(month)} {year}
                </h3>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="size-5" />
                </Button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-medium">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {days.map((day) => {
                  const dayTasks = getTasksForDate(day)
                  const hasCompleted = dayTasks.some((t) => t.completed)
                  const hasPending = dayTasks.some((t) => !t.completed)
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, today)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => onSelectDate(day)}
                      className={`
                        aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-all
                        hover:bg-muted/80
                        ${isSelected ? "bg-primary text-primary-foreground" : ""}
                        ${isToday && !isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
                      `}
                    >
                      <span className={isSelected ? "font-semibold" : ""}>{day.getDate()}</span>
                      {dayTasks.length > 0 && (
                        <div className="flex gap-0.5">
                          {hasCompleted && (
                            <div
                              className={`size-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-chart-3"}`}
                            />
                          )}
                          {hasPending && (
                            <div
                              className={`size-1.5 rounded-full ${isSelected ? "bg-primary-foreground/60" : "bg-chart-2"}`}
                            />
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Date Tasks */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {isSameDay(selectedDate, today)
                    ? "Today"
                    : selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                </h3>
                <Badge variant="outline">
                  {completedTasks.length}/{selectedDateTasks.length} completed
                </Badge>
              </div>

              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="size-8 mx-auto mb-2 opacity-50" />
                  <p>No tasks for this day</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateTasks.map((task) => {
                    const EnergyIcon = energyIcons[task.energy]
                    return (
                      <div
                        key={task.id}
                        className={`flex items-start gap-3 p-3 rounded-lg ${task.completed ? "bg-muted/50" : "bg-card border"}`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="size-5 text-chart-3 shrink-0 mt-0.5" />
                        ) : (
                          <Clock className="size-5 text-chart-2 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <EnergyIcon className={`size-3 ${energyColors[task.energy]}`} />
                            <span>{task.duration} min</span>
                            {task.notes && (
                              <>
                                <span>·</span>
                                <FileText className="size-3" />
                                <span className="truncate">{task.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
