/**
 * Shipment creation and management
 */

import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'
import { createCDEKOrder, getCDEKCityCode, getCDEKOrderInfo, CDEK_TARIFFS } from './cdek'

/**
 * Create CDEK shipment for an order
 */
export async function createCDEKShipment(orderId: string): Promise<void> {
  // Get order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    }
  })

  if (!order) {
    throw new Error(`Order ${orderId} not found`)
  }

  // Get city code
  const cityCode = await getCDEKCityCode(
    order.shippingPostalCode || undefined,
    order.shippingCity || undefined
  )

  if (!cityCode) {
    logger.error('CDEK: City not found', {
      orderId,
      city: order.shippingCity,
      postalCode: order.shippingPostalCode
    })
    throw new Error('CDEK: City not found')
  }

  // Prepare items
  const items = order.items.map(item => ({
    name: item.variant.product?.name || item.variant.name || 'Товар',
    price: item.priceAtPurchase,
    weight: 100, // grams per item (default)
    quantity: item.quantity
  }))

  // Determine tariff code based on delivery type
  const tariffCode = order.cdekPvzCode
    ? CDEK_TARIFFS.WH_TO_PVZ_ECONOMY // Pickup point
    : CDEK_TARIFFS.WH_TO_DOOR_ECONOMY // Door delivery

  // Create CDEK order
  const cdekResponse = await createCDEKOrder(
    order.orderNumber,
    {
      name: order.shippingFullName || 'Получатель',
      phone: order.phone,
      email: order.email
    },
    cityCode,
    order.shippingAddress || '',
    order.shippingPostalCode || '',
    items,
    order.cdekPvzCode || undefined,
    tariffCode
  )

  if (!cdekResponse) {
    throw new Error('CDEK order creation failed')
  }

  // Check for errors
  const errors = cdekResponse.requests?.[0]?.errors
  if (errors && errors.length > 0) {
    logger.error('CDEK order errors', { orderId, errors })
    throw new Error(`CDEK: ${errors.map(e => e.message).join(', ')}`)
  }

  // Get the order UUID
  const cdekOrderUuid = cdekResponse.entity?.uuid

  if (!cdekOrderUuid) {
    throw new Error('CDEK: No order UUID returned')
  }

  // Update order with CDEK info
  await prisma.order.update({
    where: { id: orderId },
    data: {
      cdekOrderUuid,
      status: 'PROCESSING'
    }
  })

  // Create shipment record
  await prisma.shipment.create({
    data: {
      orderId,
      carrier: 'CDEK',
      status: 'PENDING',
      trackingCode: cdekOrderUuid // Will be updated with tracking number later
    }
  })

  logger.info('CDEK shipment created', { orderId, cdekOrderUuid })
}

/**
 * Update CDEK tracking info for an order
 */
export async function updateCDEKTracking(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { cdekOrderUuid: true }
  })

  if (!order?.cdekOrderUuid) {
    throw new Error('Order has no CDEK UUID')
  }

  const cdekOrder = await getCDEKOrderInfo(order.cdekOrderUuid)

  if (!cdekOrder) {
    throw new Error('CDEK order not found')
  }

  const cdekNumber = cdekOrder.entity?.cdek_number
  const statuses = cdekOrder.entity?.statuses || []
  const lastStatus = statuses[statuses.length - 1]

  // Map CDEK status to our status
  let newStatus = 'PROCESSING'
  if (lastStatus) {
    const statusCode = lastStatus.code
    if (['DELIVERED', 'ACCEPTED_AT_PICK_UP_POINT'].includes(statusCode)) {
      newStatus = 'DELIVERED'
    } else if (['IN_TRANSIT', 'ARRIVED_AT_DELIVERY_POINT'].includes(statusCode)) {
      newStatus = 'SHIPPED'
    } else if (['RETURNED', 'DELIVERY_PROBLEM'].includes(statusCode)) {
      newStatus = 'CANCELLED'
    }
  }

  // Update order
  await prisma.order.update({
    where: { id: orderId },
    data: {
      cdekTrackingNumber: cdekNumber,
      status: newStatus as 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
    }
  })

  // Update shipment
  const shipment = await prisma.shipment.findFirst({
    where: { orderId }
  })

  if (shipment) {
    // Map order status to shipment status
    let shipmentStatus: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED' = 'PENDING'
    if (newStatus === 'DELIVERED') shipmentStatus = 'DELIVERED'
    else if (newStatus === 'SHIPPED') shipmentStatus = 'IN_TRANSIT'
    else if (newStatus === 'CANCELLED') shipmentStatus = 'RETURNED'

    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        trackingCode: cdekNumber || order.cdekOrderUuid,
        status: shipmentStatus,
        shippedAt: newStatus === 'SHIPPED' ? new Date() : shipment.shippedAt,
        deliveredAt: newStatus === 'DELIVERED' ? new Date() : null
      }
    })
  }
}
