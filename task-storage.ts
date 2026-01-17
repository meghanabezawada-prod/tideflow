// Task storage utilities

export type DayLog = {
  date: string // YYYY-MM-DD format
  tasks: any[]
  reflection?: string
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00")
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2)
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month]
}
