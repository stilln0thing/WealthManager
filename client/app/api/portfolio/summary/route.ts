import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const summary = {
      totalValue: 1372177,
      totalInvested: 1200000,
      totalGainLoss: 172177,
      totalGainLossPercent: 14.35,
      topPerformer: {
        symbol: "TCS",
        name: "Tata Consultancy Services",
        gainPercent: 20.3
      },
      worstPerformer: {
        symbol: "BAJFINANCE",
        name: "Bajaj Finance Limited",
        gainPercent: -4.9
      },
      diversificationScore: 7.8,
      riskLevel: "Moderate"
    }

    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 })
  }
}
