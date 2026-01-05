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

    // Fetch all users with details
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        companyName: true,
        inn: true,
        ogrn: true,
        legalAddress: true,
        bankAccount: true,
        bankName: true,
        bankBik: true,
        referralCode: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            sellerProducts: true,
            referralsFrom: true,
            referralsTo: true,
          },
        },
      },
    })

    // Prepare data for Excel
    const excelData = users.map((user) => {
      const baseData: any = {
        'ID': user.id,
        'Email': user.email,
        'Email подтверждён': user.emailVerified ? 'Да' : 'Нет',
        'Имя': user.name || '',
        'Телефон': user.phone || '',
        'Роль': user.role === 'ADMIN' ? 'Админ' : user.role === 'SELLER' ? 'Продавец' : 'Покупатель',
        'Реферальный код': user.referralCode || '',
        'Количество заказов': user._count.orders,
        'Пригласил рефералов': user._count.referralsFrom,
        'Приглашён по реферальной ссылке': user._count.referralsTo > 0 ? 'Да' : 'Нет',
        'Дата регистрации': new Date(user.createdAt).toLocaleString('ru-RU'),
      }

      // Add seller-specific fields if applicable
      if (user.role === 'SELLER') {
        baseData['Компания'] = user.companyName || ''
        baseData['ИНН'] = user.inn || ''
        baseData['ОГРН/ОГРНИП'] = user.ogrn || ''
        baseData['Юридический адрес'] = user.legalAddress || ''
        baseData['Расчётный счёт'] = user.bankAccount || ''
        baseData['Банк'] = user.bankName || ''
        baseData['БИК'] = user.bankBik || ''
        baseData['Товаров в каталоге'] = user._count.sellerProducts
      }

      return baseData
    })

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Пользователи')

    // Set column widths
    const maxWidth = 50
    const wscols = Object.keys(excelData[0] || {}).map((key) => ({
      wch: Math.min(
        Math.max(
          key.length,
          ...excelData.map((row) => String(row[key]).length)
        ),
        maxWidth
      ),
    }))
    worksheet['!cols'] = wscols

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    logger.info('Users exported to Excel', {
      adminId: user.id,
      userCount: users.length,
    })

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=users_${new Date().toISOString().split('T')[0]}.xlsx`,
      },
    })
  } catch (error) {
    logger.error('Error exporting users to Excel', error)
    return NextResponse.json(
      { error: 'Failed to export users' },
      { status: 500 }
    )
  }
}
