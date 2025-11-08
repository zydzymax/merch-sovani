'use client'

import { useEffect, useState } from 'react'
import { getRemainingTime, formatTimeRemaining, type TimeRemaining } from '@/lib/deadline'

interface CountdownTimerProps {
  deadline: string | undefined
  className?: string
  showLabel?: boolean
}

export function CountdownTimer({ deadline, className = '', showLabel = true }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    getRemainingTime(deadline)
  )

  useEffect(() => {
    if (!deadline) return

    const timer = setInterval(() => {
      setTimeRemaining(getRemainingTime(deadline))
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  if (!deadline || timeRemaining.isExpired) {
    return null
  }

  return (
    <div className={className}>
      {showLabel && <span className="text-sm opacity-90">До конца акции: </span>}
      <span className="font-bold tabular-nums">{formatTimeRemaining(timeRemaining)}</span>
    </div>
  )
}
