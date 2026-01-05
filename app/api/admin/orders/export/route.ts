import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/utils/logger'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Fetch all orders with details
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true, phone: true } },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    sellerId: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            status: true,
            amount: true,
            provider: true,
          },
        },
      },
    })

    // Prepare data for Excel
    const excelData = orders.map((order) => {
      const items = order.items
        .map((item) => {
          const productName = item.variant.product.name
          const variantName = item.variant.name || ''
          return `${productName} ${variantName} (x${item.quantity})`
        })
        .join('; ')

      return {
        'Номер заказа': order.orderNumber,
        'Дата создания': new Date(order.createdAt).toLocaleString('ru-RU'),
        'Статус': order.status,
        'Email': order.email,
        'Телефон': order.phone,
        'Имя клиента': order.user?.name || order.shippingFullName || '',
        'Адрес доставки': [
          order.shippingAddress,
          order.shippingCity,
          order.shippingRegion,
          order.shippingPostalCode,
        ]
          .filter(Boolean)
          .join(', '),
        'Способ доставки': order.shippingMethod || '',
        'Номер накладной СДЭК': order.cdekTrackingNumber || '',
        'Товары': items,
        'Сумма товаров (₽)': (order.subtotal / 100).toFixed(2),
        'Стоимость доставки (₽)': (order.shippingCost / 100).toFixed(2),
        'Итого (₽)': (order.total / 100).toFixed(2),
        'Статус оплаты': order.payments[0]?.status || 'PENDING',
        'Участие в акции': order.participatesInPromo ? 'Да' : 'Нет',
        'Код участия': order.entryCode || '',
        'Fraud Score': order.fraudScore,
        'IP адрес': order.ipAddress || '',
        'Примечания': order.notes || '',
      }
    })

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заказы')

    // Set column widths
    const maxWidth = 50
    const wscols = Object.keys(excelData[0] || {}).map((key) => ({
      wch: Math.min(
        Math.max(
          key.length,
          ...excelData.map((row) => String(row[key as keyof typeof row]).length)
        ),
        maxWidth
      ),
    }))
    worksheet['!cols'] = wscols

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    logger.info('Orders exported to Excel', {
      adminId: user.id,
      orderCount: orders.length,
    })

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=orders_${new Date().toISOString().split('T')[0]}.xlsx`,
      },
    })
  } catch (error) {
    logger.error('Error exporting orders to Excel', error)
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}
