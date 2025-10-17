"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate?: Date | null
  title?: string
}

export function CountdownTimer({ targetDate, title = "Countdown" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)
  const isDisabled = !targetDate

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) {
    return null
  }

  const timeUnits = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ]

  return (
    <div className="flex flex-col items-start justify-center gap-3">
      <h1
        className={`text-lg md:text-xl font-bold tracking-tight text-balance transition-opacity ${isDisabled ? "opacity-40" : ""}`}
      >
        {title}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-md">
        {timeUnits.map((unit, index) => (
          <Card
            key={unit.label}
            className={`relative overflow-hidden bg-card border-border/50 backdrop-blur-sm transition-all duration-300 ${
              isDisabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            }`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="p-2 md:p-3 flex flex-col items-center justify-center gap-1">
              <div className="text-xl md:text-3xl font-mono font-bold tabular-nums tracking-tight">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {unit.label}
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDisabled ? "bg-border/20" : "bg-primary/20"}`}
            />
          </Card>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
