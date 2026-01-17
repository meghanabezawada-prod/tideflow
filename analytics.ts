// Analytics helper functions for prescriptive insights

import type { Task } from "@/app/page"

export type DailyStats = {
  date: string
  totalTasks: number
  completed: number
  rescheduled: number
  avgDuration: number
  byEnergy: {
    high: { total: number; completed: number }
    medium: { total: number; completed: number }
    low: { total: number; completed: number }
  }
  totalFocusTime: number
}

export function calculateDailyStats(tasks: Task[]): DailyStats {
  const completed = tasks.filter((t) => t.completed)
  const rescheduled = tasks.filter((t) => !t.completed && t.rescheduledTo)

  const byEnergy = {
    high: {
      total: tasks.filter((t) => t.energy === "high").length,
      completed: completed.filter((t) => t.energy === "high").length,
    },
    medium: {
      total: tasks.filter((t) => t.energy === "medium").length,
      completed: completed.filter((t) => t.energy === "medium").length,
    },
    low: {
      total: tasks.filter((t) => t.energy === "low").length,
      completed: completed.filter((t) => t.energy === "low").length,
    },
  }

  const totalFocusTime = completed.reduce((acc, t) => acc + (t.actualDuration || t.duration), 0)
  const avgDuration = completed.length > 0 ? totalFocusTime / completed.length : 0

  return {
    date: tasks[0]?.scheduledDate || "",
    totalTasks: tasks.length,
    completed: completed.length,
    rescheduled: rescheduled.length,
    avgDuration,
    byEnergy,
    totalFocusTime,
  }
}

export function generateInsights(
  tasksByDate: Record<string, Task[]>,
  todayKey: string,
): { insights: string[]; suggestions: Array<{ type: string; message: string }> } {
  const insights: string[] = []
  const suggestions: Array<{ type: string; message: string }> = []

  // Get last 7 days of data
  const dates = Object.keys(tasksByDate).sort().slice(-7)
  const recentStats = dates.map((date) => calculateDailyStats(tasksByDate[date] || []))

  // Calculate completion rates by energy
  const allTasks = dates.flatMap((d) => tasksByDate[d] || [])
  const completedTasks = allTasks.filter((t) => t.completed)

  const energyCompletionRates = {
    high:
      allTasks.filter((t) => t.energy === "high").length > 0
        ? completedTasks.filter((t) => t.energy === "high").length / allTasks.filter((t) => t.energy === "high").length
        : 0,
    medium:
      allTasks.filter((t) => t.energy === "medium").length > 0
        ? completedTasks.filter((t) => t.energy === "medium").length /
          allTasks.filter((t) => t.energy === "medium").length
        : 0,
    low:
      allTasks.filter((t) => t.energy === "low").length > 0
        ? completedTasks.filter((t) => t.energy === "low").length / allTasks.filter((t) => t.energy === "low").length
        : 0,
  }

  // Best performing energy level
  const bestEnergy = Object.entries(energyCompletionRates).sort(([, a], [, b]) => b - a)[0]
  if (bestEnergy && bestEnergy[1] > 0) {
    insights.push(
      `You complete ${Math.round(bestEnergy[1] * 100)}% of ${bestEnergy[0]} energy tasks — your sweet spot!`,
    )
  }

  // Average tasks per day
  const avgTasksPerDay =
    recentStats.length > 0 ? recentStats.reduce((acc, s) => acc + s.completed, 0) / recentStats.length : 0
  if (avgTasksPerDay > 0) {
    insights.push(`You average ${avgTasksPerDay.toFixed(1)} completed tasks per day`)
  }

  // Rescheduled tasks pattern
  const rescheduledTasks = allTasks.filter((t) => t.rescheduledTo)
  if (rescheduledTasks.length > 0) {
    const rescheduledByEnergy = {
      high: rescheduledTasks.filter((t) => t.energy === "high").length,
      medium: rescheduledTasks.filter((t) => t.energy === "medium").length,
      low: rescheduledTasks.filter((t) => t.energy === "low").length,
    }
    const mostRescheduled = Object.entries(rescheduledByEnergy).sort(([, a], [, b]) => b - a)[0]
    if (mostRescheduled[1] > 1) {
      suggestions.push({
        type: "warning",
        message: `You often reschedule ${mostRescheduled[0]} energy tasks. Consider scheduling fewer of these or breaking them down.`,
      })
    }
  }

  // Time-based suggestions
  const avgFocusTime =
    recentStats.length > 0 ? recentStats.reduce((acc, s) => acc + s.totalFocusTime, 0) / recentStats.length : 0
  if (avgFocusTime > 0 && avgFocusTime < 60) {
    suggestions.push({
      type: "tip",
      message: `Your average daily focus time is ${Math.round(avgFocusTime)} mins. Try adding one more 20-min task tomorrow.`,
    })
  }

  // Suggest optimal task mix for tomorrow
  if (bestEnergy[1] > 0.7) {
    suggestions.push({
      type: "success",
      message: `For tomorrow, prioritize ${bestEnergy[0]} energy tasks — you excel at these!`,
    })
  }

  // If low completion rate overall
  const overallRate = allTasks.length > 0 ? completedTasks.length / allTasks.length : 0
  if (overallRate < 0.5 && allTasks.length > 3) {
    suggestions.push({
      type: "warning",
      message: `Your completion rate is ${Math.round(overallRate * 100)}%. Try planning fewer tasks or extending time estimates.`,
    })
  }

  return { insights, suggestions }
}

export function getTimerData(tasksByDate: Record<string, Task[]>): Array<{
  date: string
  planned: number
  actual: number
}> {
  const dates = Object.keys(tasksByDate).sort().slice(-7)

  return dates.map((date) => {
    const tasks = tasksByDate[date] || []
    const completed = tasks.filter((t) => t.completed)
    const planned = completed.reduce((acc, t) => acc + t.duration, 0)
    const actual = completed.reduce((acc, t) => acc + (t.actualDuration || t.duration), 0)

    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      planned,
      actual,
    }
  })
}
