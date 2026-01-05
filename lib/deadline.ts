export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
  isExpired: boolean
}

export function getRemainingTime(deadlineISO: string | undefined): TimeRemaining {
  if (!deadlineISO) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isExpired: true,
    }
  }

  const now = new Date().getTime()
  const deadline = new Date(deadlineISO).getTime()
  const difference = deadline - now

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isExpired: true,
    }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: difference,
    isExpired: false,
  }
}

export function formatTimeRemaining(time: TimeRemaining): string {
  if (time.isExpired) return 'Акция завершена'

  if (time.days > 0) {
    return `${time.days}д ${time.hours}ч ${time.minutes}м`
  }

  if (time.hours > 0) {
    return `${time.hours}ч ${time.minutes}м`
  }

  return `${time.minutes}м ${time.seconds}с`
}
