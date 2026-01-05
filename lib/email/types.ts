/**
 * Email service types
 */

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: EmailAttachment[]
}

export interface EmailAttachment {
  filename: string
  content?: Buffer | string
  path?: string
  contentType?: string
}

export interface RegistrationEmailData {
  name: string
  email: string
  password?: string
  referralCode: string
  referralLink: string
}

export interface PasswordResetEmailData {
  name: string
  email: string
  resetLink: string
  expiresIn: string
}

export interface OrderConfirmationEmailData {
  orderNumber: string
  name: string
  email: string
  total: number
  subtotal: number
  shippingCost: number
  items: Array<{
    name: string
    variant: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    fullName: string
    address: string
    city: string
    region: string
    postalCode: string
  }
  participatesInPromo: boolean
  entryCode?: string
  allEntryCodes?: string[]  // Все промокоды для множественных брелоков
  fiscalReceipt?: {
    receiptNumber: string
    fiscalSign: string
    date: string
  }
}
