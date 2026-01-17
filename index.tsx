"use client"

import { useState } from "react"
import { EnergySelector, type EnergyLevel } from "@/components/tideflow/EnergySelector"
import { FocusView } from "@/components/tideflow/FocusView"
import { TaskQueue } from "@/components/tideflow/TaskQueue"
import { ReflectionPanel } from "@/components/tideflow/ReflectionPanel"
import { Header } from "@/components/tideflow/Header"
import { TaskIntake } from "@/components/tideflow/TaskIntake"
import { CalendarView } from "@/components/tideflow/CalendarView"
import { RescheduleModal } from "@/components/tideflow/RescheduleModal"
import { LandingPage } from "@/components/tideflow/LandingPage"
import { formatDate } from "@/lib/task-storage"

export type { EnergyLevel } from "@/components/tideflow/EnergySelector"

export type Task = {
  id: string
  title: string
  energy: "high" | "medium" | "low"
  duration: number
  completed: boolean
  completedAt?: Date
  scheduledDate: string
  notes?: string
  actualDuration?: number
  rescheduledTo?: string
}

export default function TideflowApp() {
  const [showLanding, setShowLanding] = useState(true)
  const [showIntake, setShowIntake] = useState(true)
  const [energy, setEnergy] = useState<EnergyLevel | null>(null)
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({})
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showReflection, setShowReflection] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [rescheduleTask, setRescheduleTask] = useState<Task | null>(null)
  const [focusStartTime, setFocusStartTime] = useState<Date | null>(null)

  const todayKey = formatDate(new Date())
  const todayTasks = tasksByDate[todayKey] || []

  const currentTask = energy
    ? todayTasks.find((t) => !t.completed && !t.rescheduledTo && t.energy === energy) ||
      todayTasks.find((t) => !t.completed && !t.rescheduledTo)
    : null

  const completedToday = todayTasks.filter((t) => t.completed).length

  const handleCompleteTask = (notes?: string, actualDuration?: number) => {
    if (currentTask) {
      setTasksByDate((prev) => ({
        ...prev,
        [todayKey]: (prev[todayKey] || []).map((t) =>
          t.id === currentTask.id
            ? {
                ...t,
                completed: true,
                completedAt: new Date(),
                notes: notes || t.notes,
                actualDuration: actualDuration || t.duration,
              }
            : t,
        ),
      }))
      setFocusStartTime(null)
    }
  }

  const handleSkipTask = () => {
    if (currentTask) {
      setTasksByDate((prev) => {
        const todayList = prev[todayKey] || []
        const filtered = todayList.filter((t) => t.id !== currentTask.id)
        return {
          ...prev,
          [todayKey]: [...filtered, currentTask],
        }
      })
    }
  }

  const handleStartFocus = () => {
    setFocusStartTime(new Date())
  }

  const handleAddTask = (title: string, taskEnergy: "high" | "medium" | "low", duration: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      energy: taskEnergy,
      duration,
      completed: false,
      scheduledDate: todayKey,
    }
    setTasksByDate((prev) => ({
      ...prev,
      [todayKey]: [...(prev[todayKey] || []), newTask],
    }))
  }

  const handleIntakeComplete = (
    newTasks: Array<{ title: string; energy: "high" | "medium" | "low"; duration: number }>,
  ) => {
    const dateKey = formatDate(selectedDate)
    const tasksWithIds: Task[] = newTasks.map((t, i) => ({
      id: `${Date.now()}-${i}`,
      title: t.title,
      energy: t.energy,
      duration: t.duration,
      completed: false,
      scheduledDate: dateKey,
    }))
    setTasksByDate((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), ...tasksWithIds],
    }))
    setShowIntake(false)
  }

  const handleReschedule = (task: Task, newDate: Date, notes?: string) => {
    const newDateKey = formatDate(newDate)
    const oldDateKey = task.scheduledDate

    setTasksByDate((prev) => {
      // Mark original task as rescheduled with notes
      const oldDateTasks = (prev[oldDateKey] || []).map((t) =>
        t.id === task.id ? { ...t, rescheduledTo: newDateKey, notes: notes || t.notes } : t,
      )

      // Create new task for the new date
      const newTask: Task = {
        ...task,
        id: `${task.id}-rescheduled-${Date.now()}`,
        scheduledDate: newDateKey,
        notes: undefined,
        rescheduledTo: undefined,
      }
      const newDateTasks = [...(prev[newDateKey] || []), newTask]

      return {
        ...prev,
        [oldDateKey]: oldDateTasks,
        [newDateKey]: newDateTasks,
      }
    })

    setRescheduleTask(null)
    setFocusStartTime(null)
  }

  const handleGoHome = () => {
    setShowLanding(true)
    setShowIntake(true)
    setEnergy(null)
  }

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  if (showIntake) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          completedToday={completedToday}
          onOpenReflection={() => setShowReflection(true)}
          onOpenCalendar={() => setShowCalendar(true)}
          onGoHome={handleGoHome}
        />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <TaskIntake
            onComplete={handleIntakeComplete}
            onSkip={() => setShowIntake(false)}
            selectedDate={selectedDate}
          />
        </main>

        {showCalendar && (
          <CalendarView
            tasksByDate={tasksByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onClose={() => setShowCalendar(false)}
          />
        )}

        {showReflection && (
          <ReflectionPanel tasks={todayTasks} tasksByDate={tasksByDate} onClose={() => setShowReflection(false)} />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        completedToday={completedToday}
        onOpenReflection={() => setShowReflection(true)}
        onOpenCalendar={() => setShowCalendar(true)}
        onGoHome={handleGoHome}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!energy ? (
          <EnergySelector onSelect={setEnergy} />
        ) : (
          <FocusView
            task={currentTask}
            energy={energy}
            onComplete={handleCompleteTask}
            onSkip={handleSkipTask}
            onChangeEnergy={() => setEnergy(null)}
            onStartFocus={handleStartFocus}
            onReschedule={(task) => setRescheduleTask(task)}
            focusStartTime={focusStartTime}
          />
        )}

        <TaskQueue
          tasks={todayTasks.filter((t) => !t.rescheduledTo)}
          currentEnergy={energy}
          onAddTask={handleAddTask}
        />
      </main>

      {showReflection && (
        <ReflectionPanel tasks={todayTasks} tasksByDate={tasksByDate} onClose={() => setShowReflection(false)} />
      )}

      {showCalendar && (
        <CalendarView
          tasksByDate={tasksByDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {rescheduleTask && (
        <RescheduleModal
          task={rescheduleTask}
          onReschedule={handleReschedule}
          onClose={() => setRescheduleTask(null)}
        />
      )}
    </div>
  )
}
