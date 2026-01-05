/**
 * YooKassa Payment Integration
 * API Documentation: https://yookassa.ru/developers/api
 */

const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3'
const SHOP_ID = process.env.YUKASSA_SHOP_ID || ''
const SECRET_KEY = process.env.YUKASSA_SECRET_KEY || ''

interface CreatePaymentParams {
  amount: number
  currency?: string
  orderId: string
  description: string
  returnUrl: string
  items: Array<{
    description: string
    quantity: number
    amount: number
    vatCode: number
  }>
  customerEmail: string
  customerPhone?: string
  paymentMethod?: 'redirect' | 'sbp' // SBP = QR code payment
}

interface YooKassaPayment {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  amount: {
    value: string
    currency: string
  }
  confirmation?: {
    type: string
    confirmation_url?: string
    confirmation_data?: string // QR code data for SBP
  }
  created_at: string
  description?: string
  metadata?: Record<string, string>
  paid: boolean
  refundable: boolean
}

interface YooKassaRefund {
  id: string
  status: 'pending' | 'succeeded' | 'canceled'
  amount: {
    value: string
    currency: string
  }
  created_at: string
  payment_id: string
}

function getAuthHeader(): string {
  const credentials = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64')
  return `Basic ${credentials}`
}

function generateIdempotenceKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Create a payment in YooKassa
 * https://yookassa.ru/developers/api#create_payment
 */
export async function createPayment(params: CreatePaymentParams): Promise<YooKassaPayment> {
  const {
    amount,
    currency = 'RUB',
    orderId,
    description,
    returnUrl,
    items,
    customerEmail,
    customerPhone,
    paymentMethod = 'redirect'
  } = params

  // Format amount to 2 decimal places as string
  const amountValue = (amount / 100).toFixed(2)

  // Build receipt items for 54-FZ compliance
  const receiptItems = items.map(item => ({
    description: item.description.substring(0, 128), // Max 128 chars
    quantity: item.quantity.toString(),
    amount: {
      value: (item.amount / 100).toFixed(2),
      currency
    },
    vat_code: item.vatCode, // 1 = Без НДС (for ИП на УСН)
    payment_subject: 'commodity', // Товар
    payment_mode: 'full_payment' // Полный расчет
  }))

  // Build confirmation based on payment method
  const confirmation = paymentMethod === 'sbp'
    ? { type: 'qr' }  // SBP QR code
    : { type: 'redirect', return_url: returnUrl }  // Regular redirect

  const payload: Record<string, unknown> = {
    amount: {
      value: amountValue,
      currency
    },
    confirmation,
    capture: true, // Auto-capture payment
    description: description.substring(0, 128),
    metadata: {
      order_id: orderId
    },
    receipt: {
      customer: {
        email: customerEmail,
        ...(customerPhone && { phone: customerPhone.replace(/\D/g, '') })
      },
      items: receiptItems
    }
  }

  // For SBP, we need to specify payment method
  if (paymentMethod === 'sbp') {
    payload.payment_method_data = { type: 'sbp' }
  }

  const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
      'Idempotence-Key': generateIdempotenceKey()
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('YooKassa create payment error:', error)
    throw new Error(`YooKassa payment creation failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Get payment status from YooKassa
 * https://yookassa.ru/developers/api#get_payment
 */
export async function getPayment(paymentId: string): Promise<YooKassaPayment> {
  const response = await fetch(`${YOOKASSA_API_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': getAuthHeader()
    }
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('YooKassa get payment error:', error)
    throw new Error(`YooKassa get payment failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Create a refund in YooKassa
 * https://yookassa.ru/developers/api#create_refund
 */
export async function createRefund(paymentId: string, amount: number, currency = 'RUB'): Promise<YooKassaRefund> {
  const amountValue = (amount / 100).toFixed(2)

  const payload = {
    payment_id: paymentId,
    amount: {
      value: amountValue,
      currency
    }
  }

  const response = await fetch(`${YOOKASSA_API_URL}/refunds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
      'Idempotence-Key': generateIdempotenceKey()
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('YooKassa create refund error:', error)
    throw new Error(`YooKassa refund creation failed: ${response.status}`)
  }

  return response.json()
}

// YooKassa IP addresses for webhook verification
// https://yookassa.ru/developers/using-api/webhooks
export const YOOKASSA_IPS = [
  '185.71.76.',
  '185.71.77.',
  '77.75.153.',
  '77.75.154.',
  '77.75.156.11',
  '77.75.156.35'
]

export function isYooKassaIP(ip: string): boolean {
  return YOOKASSA_IPS.some(prefix => ip.startsWith(prefix) || ip === prefix)
}
