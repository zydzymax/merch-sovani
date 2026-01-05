/**
 * CDEK API v2 Integration
 * Docs: https://api-docs.cdek.ru/
 */

import { logger } from '@/lib/utils/logger'

const CDEK_API_URL = process.env.CDEK_API_URL || 'https://api.cdek.ru/v2'
const CDEK_CLIENT_ID = process.env.CDEK_CLIENT_ID || ''
const CDEK_CLIENT_SECRET = process.env.CDEK_CLIENT_SECRET || ''

// Sender address (from Moscow)
const SENDER_CITY_CODE = 44 // Moscow

interface CDEKToken {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  jti: string
  expires_at: number
}

interface CDEKLocation {
  code: number
  city: string
  region: string
  country_code: string
  postal_code?: string
  address?: string
}

interface CDEKPickupPoint {
  code: string
  name: string
  location: {
    country_code: string
    region_code: number
    region: string
    city_code: number
    city: string
    postal_code: string
    longitude: number
    latitude: number
    address: string
    address_full: string
  }
  address_comment?: string
  work_time: string
  phones: { number: string }[]
  type: 'PVZ' | 'POSTAMAT'
  owner_code: string
  is_dressing_room: boolean
  have_cashless: boolean
  have_cash: boolean
  allowed_cod: boolean
  nearest_station?: string
  nearest_metro_station?: string
  dimensions?: { width: number; height: number; depth: number }[]
  weight_max?: number
  weight_min?: number
}

interface CDEKTariff {
  tariff_code: number
  tariff_name: string
  tariff_description: string
  delivery_mode: number
  delivery_sum: number
  period_min: number
  period_max: number
  calendar_min?: number
  calendar_max?: number
}

interface CDEKCalculatorResponse {
  tariff_codes: CDEKTariff[]
  currency: string
}

interface CDEKOrderRequest {
  type?: number // 1 = online store
  number: string // order number
  tariff_code: number
  sender: {
    company?: string
    name?: string
    phones?: { number: string }[]
  }
  recipient: {
    name: string
    phones: { number: string }[]
    email?: string
  }
  from_location: {
    code?: number
    city?: string
    address?: string
  }
  to_location: {
    code?: number
    city?: string
    address?: string
    postal_code?: string
  }
  delivery_point?: string // PVZ code
  packages: {
    number: string
    weight: number // grams
    length?: number
    width?: number
    height?: number
    comment?: string
    items?: {
      name: string
      ware_key: string
      payment: { value: number }
      cost: number
      weight: number
      amount: number
    }[]
  }[]
}

interface CDEKOrderResponse {
  entity: {
    uuid: string
    orders: { order_uuid: string }[]
  }
  requests: { request_uuid: string; type: string; state: string; date_time: string; errors?: { code: string; message: string }[] }[]
}

interface CDEKOrderInfo {
  entity: {
    uuid: string
    is_return: boolean
    is_reverse: boolean
    cdek_number?: string
    number?: string
    statuses: { code: string; name: string; date_time: string; city: string }[]
    delivery_point?: string
    tariff_code: number
    recipient: { name: string }
    sender: { name: string }
    from_location: { code: number; city: string }
    to_location: { code: number; city: string; address: string }
    packages: { number: string; weight: number }[]
  }
}

// Token cache
let tokenCache: CDEKToken | null = null

/**
 * Get OAuth token from CDEK
 */
export async function getCDEKToken(): Promise<string> {
  // Check cache
  if (tokenCache && tokenCache.expires_at > Date.now()) {
    return tokenCache.access_token
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CDEK_CLIENT_ID,
      client_secret: CDEK_CLIENT_SECRET,
    })

    const response = await fetch(`${CDEK_API_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })

    if (!response.ok) {
      throw new Error(`CDEK auth failed: ${response.status}`)
    }

    const data = await response.json()

    // Cache token (expires_in is in seconds, subtract 60 for safety margin)
    tokenCache = {
      ...data,
      expires_at: Date.now() + (data.expires_in - 60) * 1000,
    }

    return tokenCache!.access_token
  } catch (error) {
    logger.error('CDEK token error', error)
    throw error
  }
}

/**
 * Get CDEK city code by postal code or city name
 */
export async function getCDEKCityCode(postalCode?: string, cityName?: string): Promise<number | null> {
  try {
    const token = await getCDEKToken()

    const params = new URLSearchParams()
    if (postalCode) params.set('postal_code', postalCode)
    if (cityName) params.set('city', cityName)
    params.set('country_codes', 'RU')
    params.set('size', '1')

    const response = await fetch(`${CDEK_API_URL}/location/cities?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data: CDEKLocation[] = await response.json()
    return data.length > 0 ? data[0].code : null
  } catch (error) {
    logger.error('CDEK city lookup error', error)
    return null
  }
}

/**
 * Get pickup points (PVZ) by city code
 */
export async function getCDEKPickupPoints(cityCode: number): Promise<CDEKPickupPoint[]> {
  try {
    const token = await getCDEKToken()

    const params = new URLSearchParams({
      city_code: cityCode.toString(),
      type: 'PVZ,POSTAMAT',
      is_handout: 'true',
    })

    const response = await fetch(`${CDEK_API_URL}/deliverypoints?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return []
    }

    return await response.json()
  } catch (error) {
    logger.error('CDEK pickup points error', error)
    return []
  }
}

/**
 * Calculate delivery cost
 */
export async function calculateCDEKDelivery(
  toCityCode: number,
  weight: number = 500, // grams
  length: number = 20,
  width: number = 15,
  height: number = 5
): Promise<CDEKTariff[]> {
  try {
    const token = await getCDEKToken()

    const body = {
      from_location: { code: SENDER_CITY_CODE },
      to_location: { code: toCityCode },
      packages: [{ weight, length, width, height }],
    }

    const response = await fetch(`${CDEK_API_URL}/calculator/tarifflist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return []
    }

    const data: CDEKCalculatorResponse = await response.json()
    return data.tariff_codes || []
  } catch (error) {
    logger.error('CDEK calculate error', error)
    return []
  }
}

/**
 * Create shipment order
 */
export async function createCDEKOrder(
  orderNumber: string,
  recipient: { name: string; phone: string; email?: string },
  toCityCode: number,
  address: string,
  postalCode: string,
  items: { name: string; price: number; weight: number; quantity: number }[],
  deliveryPoint?: string, // PVZ code if pickup
  tariffCode: number = 136 // Default: "Посылка склад-дверь"
): Promise<CDEKOrderResponse | null> {
  try {
    const token = await getCDEKToken()

    const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0)

    const body: CDEKOrderRequest = {
      type: 1, // Online store
      number: orderNumber,
      tariff_code: tariffCode,
      sender: {
        company: 'GETNWIN',
      },
      recipient: {
        name: recipient.name,
        phones: [{ number: recipient.phone }],
        email: recipient.email,
      },
      from_location: {
        code: SENDER_CITY_CODE,
      },
      to_location: {
        code: toCityCode,
        address: address,
        postal_code: postalCode,
      },
      packages: [{
        number: `${orderNumber}-1`,
        weight: totalWeight || 500,
        items: items.map((item, idx) => ({
          name: item.name,
          ware_key: `SKU-${idx}`,
          payment: { value: 0 }, // Already paid
          cost: item.price,
          weight: item.weight || 100,
          amount: item.quantity,
        })),
      }],
    }

    // If pickup point selected
    if (deliveryPoint) {
      body.delivery_point = deliveryPoint
      delete body.to_location.address
    }

    const response = await fetch(`${CDEK_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      logger.error('CDEK create order error', { status: response.status, error })
      return null
    }

    return await response.json()
  } catch (error) {
    logger.error('CDEK create order error', error)
    return null
  }
}

/**
 * Get order tracking info
 */
export async function getCDEKOrderInfo(orderUuid: string): Promise<CDEKOrderInfo | null> {
  try {
    const token = await getCDEKToken()

    const response = await fetch(`${CDEK_API_URL}/orders/${orderUuid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    logger.error('CDEK order info error', error)
    return null
  }
}

/**
 * Get cheapest tariff for given destination
 * Returns null if no tariffs available
 */
export async function getCheapestCDEKTariff(toCityCode: number): Promise<CDEKTariff | null> {
  const tariffs = await calculateCDEKDelivery(toCityCode)

  if (tariffs.length === 0) return null

  // Filter for "door delivery" tariffs (codes 136, 137, 138, 233, etc)
  const doorTariffs = tariffs.filter(t =>
    [136, 137, 138, 233, 234, 291, 293, 294].includes(t.tariff_code)
  )

  if (doorTariffs.length === 0) return tariffs[0]

  // Return cheapest
  return doorTariffs.reduce((min, t) =>
    t.delivery_sum < min.delivery_sum ? t : min
  )
}

// CDEK tariff codes reference
export const CDEK_TARIFFS = {
  // Door-to-door
  DOOR_TO_DOOR_EXPRESS: 291, // Express
  DOOR_TO_DOOR_ECONOMY: 293, // Economy

  // Warehouse-to-door
  WH_TO_DOOR_EXPRESS: 136, // Express
  WH_TO_DOOR_ECONOMY: 137, // Economy

  // Warehouse-to-pickup
  WH_TO_PVZ_EXPRESS: 138, // Express
  WH_TO_PVZ_ECONOMY: 139, // Economy

  // Warehouse-to-postamat
  WH_TO_POSTAMAT: 366,
}
