import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type { EmailOptions } from './types'
import { logger } from '@/lib/utils/logger'

class EmailService {
  private transporter: Transporter | null = null
  private isConfigured = false

  constructor() {
    this.initialize()
  }

  private initialize() {
    // Check if email is configured
    const emailEnabled = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS

    if (!emailEnabled) {
      logger.warn('Email service not configured - emails will be logged but not sent', {
        required: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'],
      })
      return
    }

    try {
      // Create transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      this.isConfigured = true
      logger.info('Email service initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize email service', error)
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    const from = options.from || process.env.SMTP_FROM || 'SoVAni <shop@sovani.info>'

    // If email is not configured, just log and return success
    if (!this.isConfigured || !this.transporter) {
      logger.warn('Email not sent (service not configured)', {
        to: options.to,
        subject: options.subject,
        from,
      })
      return true
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      })

      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
      })

      return true
    } catch (error) {
      logger.error('Failed to send email', error, {
        to: options.to,
        subject: options.subject,
      })
      return false
    }
  }

  /**
   * Verify email service configuration
   */
  async verify(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      logger.info('Email service verified successfully')
      return true
    } catch (error) {
      logger.error('Email service verification failed', error)
      return false
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()
