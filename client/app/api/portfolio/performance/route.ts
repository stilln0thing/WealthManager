import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const performance = {
      timeline: [
        {
          date: "2024-01-01",
          portfolio: 1200000,
          nifty50: 21000,
          gold: 62000
        },
        {
          date: "2024-02-01",
          portfolio: 1250000,
          nifty50: 21500,
          gold: 63200
        },
        {
          date: "2024-03-01",
          portfolio: 1180000,
          nifty50: 22100,
          gold: 64500
        },
        {
          date: "2024-04-01",
          portfolio: 1320000,
          nifty50: 22800,
          gold: 66000
        },
        {
          date: "2024-05-01",
          portfolio: 1280000,
          nifty50: 23200,
          gold: 67500
        },
        {
          date: "2024-06-01",
          portfolio: 1372177,
          nifty50: 23500,
          gold: 68000
        }
      ],
      returns: {
        portfolio: { "1month": 7.2, "3months": 16.3, "1year": 14.3 },
        nifty50: { "1month": 1.3, "3months": 6.3, "1year": 11.9 },
        gold: { "1month": 0.7, "3months": 5.4, "1year": 9.7 }
      }
    }

    return NextResponse.json(performance)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch performance' }, { status: 500 })
  }
}
