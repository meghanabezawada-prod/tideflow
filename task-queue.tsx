"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronDown, Zap, Coffee, Moon, Clock } from "lucide-react"
import type { Task, EnergyLevel } from "@/app/page"

interface TaskQueueProps {
  tasks: Task[]
  currentEnergy: EnergyLevel
  onAddTask: (title: string, energy: "high" | "medium" | "low", duration: number) => void
}

const energyConfig = {
  high: { icon: Zap, label: "High", color: "bg-chart-1/10 text-chart-1" },
  medium: { icon: Coffee, label: "Medium", color: "bg-chart-2/10 text-chart-2" },
  low: { icon: Moon, label: "Low", color: "bg-chart-3/10 text-chart-3" },
}

export function TaskQueue({ tasks, currentEnergy, onAddTask }: TaskQueueProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newEnergy, setNewEnergy] = useState<"high" | "medium" | "low">("medium")
  const [newDuration, setNewDuration] = useState("30")

  const pendingTasks = tasks.filter((t) => !t.completed)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim()) {
      onAddTask(newTitle.trim(), newEnergy, Number.parseInt(newDuration))
      setNewTitle("")
      setShowAddForm(false)
    }
  }

  return (
    <div className="mt-12">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground">
            <span className="flex items-center gap-2">
              <span className="font-medium">{pendingTasks.length} tasks waiting</span>
            </span>
            <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            {pendingTasks.map((task) => {
              const config = energyConfig[task.energy]
              const Icon = config.icon
              const isMatched = currentEnergy === task.energy

              return (
                <Card key={task.id} className={`transition-all ${isMatched ? "border-primary/30 bg-primary/5" : ""}`}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${config.color}`}>
                      <Icon className="size-3.5" />
                    </div>
                    <span className="flex-1 text-sm">{task.title}</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {task.duration}m
                    </div>
                    {isMatched && (
                      <Badge variant="secondary" className="text-xs">
                        Matched
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {showAddForm ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add a task</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">What needs to be done?</Label>
                    <Input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Review project proposal"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Energy required</Label>
                      <Select value={newEnergy} onValueChange={(v) => setNewEnergy(v as typeof newEnergy)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">
                            <span className="flex items-center gap-2">
                              <Zap className="size-3.5" /> High
                            </span>
                          </SelectItem>
                          <SelectItem value="medium">
                            <span className="flex items-center gap-2">
                              <Coffee className="size-3.5" /> Medium
                            </span>
                          </SelectItem>
                          <SelectItem value="low">
                            <span className="flex items-center gap-2">
                              <Moon className="size-3.5" /> Low
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Select value={newDuration} onValueChange={setNewDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="45">45 min</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" size="sm">
                      Add task
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => setShowAddForm(true)}>
              <Plus className="size-4" />
              Add a task
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
