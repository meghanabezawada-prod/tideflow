// Smart task categorization based on keywords, complexity, and cognitive load patterns

type TaskCategory = {
  energy: "high" | "medium" | "low"
  priority: "urgent" | "important" | "normal"
  estimatedDuration: number
  reasoning: string
}

// Keywords that indicate high cognitive load / high energy tasks
const HIGH_ENERGY_KEYWORDS = [
  "present",
  "presentation",
  "negotiate",
  "conflict",
  "resolve",
  "strategy",
  "plan",
  "design",
  "architect",
  "lead",
  "facilitate",
  "interview",
  "hire",
  "fire",
  "difficult",
  "1:1",
  "one-on-one",
  "feedback",
  "performance",
  "escalat",
  "crisis",
  "urgent",
  "critical",
  "deadline",
  "decision",
  "stakeholder",
  "executive",
  "budget",
  "forecast",
  "proposal",
  "pitch",
]

// Keywords that indicate medium cognitive load
const MEDIUM_ENERGY_KEYWORDS = [
  "review",
  "write",
  "draft",
  "prepare",
  "update",
  "create",
  "analyze",
  "report",
  "document",
  "meeting",
  "agenda",
  "plan",
  "schedule",
  "coordinate",
  "follow up",
  "check",
  "assess",
  "evaluate",
  "summarize",
  "compile",
]

// Keywords that indicate low cognitive load / routine tasks
const LOW_ENERGY_KEYWORDS = [
  "email",
  "inbox",
  "respond",
  "reply",
  "slack",
  "messages",
  "organize",
  "file",
  "archive",
  "approve",
  "timesheet",
  "expense",
  "book",
  "calendar",
  "remind",
  "notify",
  "send",
  "forward",
  "copy",
  "move",
  "delete",
  "clean",
]

// Priority indicators
const URGENT_KEYWORDS = ["asap", "urgent", "today", "now", "immediately", "critical", "deadline", "eod", "eob"]
const IMPORTANT_KEYWORDS = ["important", "key", "major", "significant", "priority", "essential", "must"]

export function analyzeTask(taskTitle: string): TaskCategory {
  const title = taskTitle.toLowerCase()

  // Count keyword matches for each energy level
  const highScore = HIGH_ENERGY_KEYWORDS.filter((k) => title.includes(k)).length
  const mediumScore = MEDIUM_ENERGY_KEYWORDS.filter((k) => title.includes(k)).length
  const lowScore = LOW_ENERGY_KEYWORDS.filter((k) => title.includes(k)).length

  // Determine energy level
  let energy: "high" | "medium" | "low"
  let reasoning = ""

  if (highScore > mediumScore && highScore > lowScore) {
    energy = "high"
    reasoning = "Requires deep focus and strategic thinking"
  } else if (lowScore > mediumScore && lowScore >= highScore) {
    energy = "low"
    reasoning = "Routine task, minimal cognitive load"
  } else if (mediumScore > 0) {
    energy = "medium"
    reasoning = "Moderate focus needed"
  } else {
    // Default based on word count (longer = more complex)
    const wordCount = title.split(/\s+/).length
    if (wordCount > 8) {
      energy = "high"
      reasoning = "Complex task description suggests higher effort"
    } else if (wordCount > 4) {
      energy = "medium"
      reasoning = "Standard task complexity"
    } else {
      energy = "low"
      reasoning = "Simple, straightforward task"
    }
  }

  // Determine priority
  let priority: "urgent" | "important" | "normal"
  if (URGENT_KEYWORDS.some((k) => title.includes(k))) {
    priority = "urgent"
  } else if (IMPORTANT_KEYWORDS.some((k) => title.includes(k))) {
    priority = "important"
  } else {
    priority = "normal"
  }

  let estimatedDuration: number
  if (energy === "high") {
    estimatedDuration = title.includes("meeting") || title.includes("session") ? 60 : 40
  } else if (energy === "medium") {
    estimatedDuration = 40
  } else {
    estimatedDuration = 20
  }

  return { energy, priority, estimatedDuration, reasoning }
}

export function analyzeBulkTasks(tasks: string[]): Array<{ title: string } & TaskCategory> {
  return tasks.map((title) => ({
    title,
    ...analyzeTask(title),
  }))
}
