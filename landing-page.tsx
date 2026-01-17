"use client"

import { Button } from "@/components/ui/button"
import { Waves, Zap, Brain, Calendar, ArrowRight, Check } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
              <Waves className="size-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl tracking-tight">Tideflow</span>
          </div>
          <Button onClick={onGetStarted} className="rounded-full px-6">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Waves className="size-4" />
            <span>Productivity that flows with you</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-6 text-balance">
            Work with your
            <br />
            <span className="text-primary">natural rhythm</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
            Stop fighting your energy. Tideflow matches tasks to how you actually feel, showing you one thing at a time
            so you can finally focus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={onGetStarted} className="rounded-full px-8 py-6 text-lg gap-2 group">
              Start focusing
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground">No signup required</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border bg-card/50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "73%", label: "Less context switching" },
              { value: "2.5x", label: "More tasks completed" },
              { value: "45min", label: "Saved daily on decisions" },
              { value: "89%", label: "Report less burnout" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-3xl sm:text-4xl text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">How Tideflow works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A simple flow that respects your mental state
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Brain dump your tasks",
                description:
                  "Just type what's on your mind. Our smart analyzer categorizes each task by the mental energy it requires.",
              },
              {
                icon: Zap,
                title: "Set your energy",
                description:
                  "Feeling sharp? Drained? Just okay? Tell us your state and we'll surface the right task for right now.",
              },
              {
                icon: Calendar,
                title: "Flow or reschedule",
                description:
                  "Can't finish? No guilt. Push tasks to another day with one tap. Check your history anytime.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6">
                Built for overwhelmed minds
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
                Traditional to-do apps show you everything at once, creating decision paralysis. Tideflow was designed
                based on cognitive load research to reduce mental fatigue.
              </p>
              <ul className="space-y-4">
                {[
                  "One task at a time, matched to your energy",
                  "No notifications, no badges, no anxiety",
                  "Smart analysis saves you from categorizing",
                  "Reschedule without guilt or friction",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Check className="size-4" />
                    </div>
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-primary-foreground/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="font-serif text-6xl sm:text-7xl mb-4">1</div>
                  <div className="text-xl text-primary-foreground/80">task at a time</div>
                  <div className="text-sm text-primary-foreground/60 mt-2">That's the whole philosophy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6">
            Ready to stop drowning in tasks?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Start using Tideflow now. No account needed. Just you and your tasks, flowing at your natural pace.
          </p>
          <Button size="lg" onClick={onGetStarted} className="rounded-full px-10 py-6 text-lg gap-2 group">
            Start your flow
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Waves className="size-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg">Tideflow</span>
          </div>
          <p className="text-sm text-muted-foreground">Work with your rhythm, not against it.</p>
        </div>
      </footer>
    </div>
  )
}
