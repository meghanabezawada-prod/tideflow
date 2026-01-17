"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, X, CalendarClock, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { getDaysInMonth, getMonthName, isSameDay } from "@/lib/task-storage"
import type { Task } from "@/app/page"

interface RescheduleModalProps {
  task: Task
  onReschedule: (task: Task, newDate: Date, notes?: string) => void
  onClose: () => void
}

export function RescheduleModal({ task, onReschedule, onClose }: RescheduleModalProps) {
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)

  const today = new Date()
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const days = getDaysInMonth(year, month)
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleConfirm = () => {
    if (selectedDate) {
      onReschedule(task, selectedDate, notes || undefined)
    }
  }

  const isPastDay = (day: Date) => {
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate())
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return dayStart < todayStart
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] animate-in fade-in duration-200">
      <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-5 text-primary" />
              <CardTitle className="text-lg">Reschedule Task</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium text-sm">{task.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {task.duration} min · {task.energy} energy
              </p>
            </div>

            {/* Mini Calendar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="size-8" onClick={prevMonth}>
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="font-medium text-sm">
                  {getMonthName(month)} {year}
                </span>
                <Button variant="ghost" size="icon" className="size-8" onClick={nextMonth}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {days.map((day) => {
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, today)
                  const isPast = isPastDay(day)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => !isPast && setSelectedDate(day)}
                      disabled={isPast}
                      className={`
                        aspect-square rounded-md flex items-center justify-center text-xs transition-all
                        ${isPast ? "text-muted-foreground/40 cursor-not-allowed" : "hover:bg-muted"}
                        ${isSelected ? "bg-primary text-primary-foreground" : ""}
                        ${isToday && !isSelected ? "ring-1 ring-primary" : ""}
                      `}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedDate && (
              <p className="text-sm text-center text-muted-foreground">
                Move to{" "}
                <span className="font-medium text-foreground">
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </span>
              </p>
            )}

            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
                className="w-full text-muted-foreground gap-1 justify-center"
              >
                <FileText className="size-4" />
                Add reason (optional)
                {showNotes ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </Button>

              {showNotes && (
                <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Why are you rescheduling? (e.g., ran out of time, need more info...)"
                    className="text-sm min-h-[60px] resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirm} disabled={!selectedDate}>
                Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
