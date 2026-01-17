"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Coffee, Moon } from "lucide-react"

export type EnergyLevel = "high" | "medium" | "low"

interface EnergySelectorProps {
  onSelect: (energy: EnergyLevel) => void
}

const energyOptions = [
  {
    level: "high" as const,
    icon: Zap,
    title: "High Energy",
    description: "Ready for deep work and complex tasks",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10 hover:bg-chart-1/20",
  },
  {
    level: "medium" as const,
    icon: Coffee,
    title: "Medium Energy",
    description: "Good for collaborative and routine work",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10 hover:bg-chart-2/20",
  },
  {
    level: "low" as const,
    icon: Moon,
    title: "Low Energy",
    description: "Best for simple, mechanical tasks",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10 hover:bg-chart-3/20",
  },
]

export function EnergySelector({ onSelect }: EnergySelectorProps) {
  return (
    <div className="py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-semibold tracking-tight mb-3 text-balance">How are you feeling right now?</h1>
        <p className="text-muted-foreground text-lg">{"We'll match tasks to your current energy level"}</p>
      </div>

      <div className="grid gap-4">
        {energyOptions.map((option) => (
          <Card
            key={option.level}
            className={`cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-primary/20 ${option.bgColor}`}
            onClick={() => onSelect(option.level)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${option.bgColor} ${option.color}`}>
                  <option.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{option.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
