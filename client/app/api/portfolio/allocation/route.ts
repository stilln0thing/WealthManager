import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const allocation = {
      bySector: {
        Technology: { value: 489843.75, percentage: 35.7 },
        Banking: { value: 283896.00, percentage: 20.7 },
        Energy: { value: 134025.00, percentage: 9.8 },
        Healthcare: { value: 77124.00, percentage: 5.6 },
        "Financial Services": { value: 171256.25, percentage: 12.5 },
        Automotive: { value: 450032.00, percentage: 32.8 }
      },
      byMarketCap: {
        Large: { value: 900000, percentage: 65.6 },
        Mid: { value: 350000, percentage: 25.5 },
        Small: { value: 122177, percentage: 8.9 }
      }
    }

    return NextResponse.json(allocation)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch allocation' }, { status: 500 })
  }
}
