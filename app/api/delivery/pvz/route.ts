import { NextRequest, NextResponse } from 'next/server'
import { getCDEKCityCode, getCDEKPickupPoints } from '@/lib/delivery/cdek'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const postalCode = searchParams.get('postal_code')

    if (!city && !postalCode) {
      return NextResponse.json({ error: 'Укажите город или индекс' }, { status: 400 })
    }

    // Get city code
    const cityCode = await getCDEKCityCode(postalCode || undefined, city || undefined)

    if (!cityCode) {
      return NextResponse.json({ error: 'Город не найден' }, { status: 404 })
    }

    // Get pickup points
    const pvzList = await getCDEKPickupPoints(cityCode)

    // Format for frontend
    const points = pvzList.map(pvz => ({
      code: pvz.code,
      name: pvz.name,
      address: pvz.location.address_full || pvz.location.address,
      workTime: pvz.work_time,
      type: pvz.type,
      hasCard: pvz.have_cashless,
      hasCash: pvz.have_cash,
      phone: pvz.phones?.[0]?.number,
      metro: pvz.nearest_metro_station,
      lat: pvz.location.latitude,
      lng: pvz.location.longitude,
    }))

    return NextResponse.json({
      cityCode,
      points,
      count: points.length,
    })
  } catch (error) {
    console.error('PVZ API error:', error)
    return NextResponse.json({ error: 'Ошибка загрузки ПВЗ' }, { status: 500 })
  }
}
