/**
 * Email helpers - main entry point for sending emails
 */

import { emailService } from './emailService'
import { renderRegistrationEmail, renderRegistrationEmailText } from './templates/registration'
import { renderOrderConfirmationEmail, renderOrderConfirmationEmailText } from './templates/orderConfirmation'
import type { RegistrationEmailData, OrderConfirmationEmailData } from './types'
import { logger } from '@/lib/utils/logger'

/**
 * Send welcome email after user registration
 */
export async function sendRegistrationEmail(data: RegistrationEmailData): Promise<boolean> {
  try {
    const html = renderRegistrationEmail(data)
    const text = renderRegistrationEmailText(data)

    const sent = await emailService.sendEmail({
      to: data.email,
      subject: `Добро пожаловать в SoVAni! 🎉`,
      html,
      text,
    })

    if (sent) {
      logger.info('Registration email sent', { email: data.email })
    } else {
      logger.warn('Registration email not sent', { email: data.email })
    }

    return sent
  } catch (error) {
    logger.error('Failed to send registration email', error, { email: data.email })
    return false
  }
}

/**
 * Send order confirmation email after successful payment
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData): Promise<boolean> {
  try {
    const html = renderOrderConfirmationEmail(data)
    const text = renderOrderConfirmationEmailText(data)

    const sent = await emailService.sendEmail({
      to: data.email,
      subject: `Заказ ${data.orderNumber} подтвержден! ✅`,
      html,
      text,
    })

    if (sent) {
      logger.info('Order confirmation email sent', {
        email: data.email,
        orderNumber: data.orderNumber,
      })
    } else {
      logger.warn('Order confirmation email not sent', {
        email: data.email,
        orderNumber: data.orderNumber,
      })
    }

    return sent
  } catch (error) {
    logger.error('Failed to send order confirmation email', error, {
      email: data.email,
      orderNumber: data.orderNumber,
    })
    return false
  }
}

// Export email service for direct access if needed
export { emailService }
export type { RegistrationEmailData, OrderConfirmationEmailData }
