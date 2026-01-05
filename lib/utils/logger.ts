/**
 * Production-ready logging utility
 *
 * Features:
 * - Structured logging with timestamps
 * - Environment-aware (development vs production)
 * - Consistent log format
 * - Easy integration with external logging services (Sentry, DataDog, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  /**
   * Info level logging - important business events
   * Only shown in development or when explicitly needed
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment || process.env.LOG_LEVEL === 'verbose') {
      console.log(this.formatMessage('info', message, context))
    }
  }

  /**
   * Warning level - potential issues that don't break functionality
   * Always logged in production
   */
  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context))
  }

  /**
   * Error level - critical errors that need immediate attention
   * Always logged and should be sent to error tracking service
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    }

    console.error(this.formatMessage('error', message, errorContext))

    // TODO: Send to error tracking service (Sentry, DataDog, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   await errorTracker.captureException(error, { message, ...context })
    // }
  }

  /**
   * Debug level - detailed debugging information
   * Only shown in development
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context))
    }
  }

  /**
   * Payment-specific logging helper
   */
  payment(action: string, details: {
    paymentId?: string
    orderId?: string
    orderNumber?: string
    amount?: number
    status?: string
  }) {
    this.info(`Payment ${action}`, details)
  }

  /**
   * Order-specific logging helper
   */
  order(action: string, details: {
    orderId?: string
    orderNumber?: string
    userId?: string
    total?: number
    status?: string
  }) {
    this.info(`Order ${action}`, details)
  }

  /**
   * Auth-specific logging helper
   */
  auth(action: string, details: {
    userId?: string
    email?: string
    role?: string
    success?: boolean
  }) {
    // Never log passwords or sensitive auth data
    const sanitized = { ...details }
    delete (sanitized as any).password
    delete (sanitized as any).token

    this.info(`Auth ${action}`, sanitized)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for testing
export { Logger }
