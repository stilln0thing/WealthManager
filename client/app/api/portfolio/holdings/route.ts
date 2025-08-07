import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const holdings = [
      {
        symbol: "RELIANCE",
        name: "Reliance Industries Ltd",
        quantity: 50,
        avgPrice: 2450.00,
        currentPrice: 2680.50,
        sector: "Energy",
        marketCap: "Large",
        value: 134025.00,
        gainLoss: 11525.00,
        gainLossPercent: 9.4
      },
      {
        symbol: "INFY",
        name: "Infosys Limited",
        quantity: 100,
        avgPrice: 1800.00,
        currentPrice: 2010.75,
        sector: "Technology",
        marketCap: "Large",
        value: 201075.00,
        gainLoss: 21075.00,
        gainLossPercent: 11.7
      },
      {
        symbol: "TCS",
        name: "Tata Consultancy Services",
        quantity: 75,
        avgPrice: 3200.00,
        currentPrice: 3850.25,
        sector: "Technology",
        marketCap: "Large",
        value: 288768.75,
        gainLoss: 48768.75,
        gainLossPercent: 20.3
      },
      {
        symbol: "HDFC",
        name: "HDFC Bank",
        quantity: 120,
        avgPrice: 1650.00,
        currentPrice: 1615.30,
        sector: "Banking",
        marketCap: "Large",
        value: 193836.00,
        gainLoss: -4164.00,
        gainLossPercent: -2.1
      },
      {
        symbol: "ICICIBANK",
        name: "ICICI Bank Limited",
        quantity: 80,
        avgPrice: 950.00,
        currentPrice: 1125.75,
        sector: "Banking",
        marketCap: "Large",
        value: 90060.00,
        gainLoss: 14060.00,
        gainLossPercent: 18.5
      },
      {
        symbol: "SUNPHARMA",
        name: "Sun Pharmaceutical Industries",
        quantity: 60,
        avgPrice: 1100.00,
        currentPrice: 1285.40,
        sector: "Healthcare",
        marketCap: "Large",
        value: 77124.00,
        gainLoss: 11124.00,
        gainLossPercent: 16.9
      },
      {
        symbol: "BAJFINANCE",
        name: "Bajaj Finance Limited",
        quantity: 25,
        avgPrice: 7200.00,
        currentPrice: 6850.25,
        sector: "Financial Services",
        marketCap: "Large",
        value: 171256.25,
        gainLoss: -8743.75,
        gainLossPercent: -4.9
      },
      {
        symbol: "MARUTI",
        name: "Maruti Suzuki India Limited",
        quantity: 40,
        avgPrice: 9500.00,
        currentPrice: 11250.80,
        sector: "Automotive",
        marketCap: "Large",
        value: 450032.00,
        gainLoss: 70032.00,
        gainLossPercent: 18.4
      }
    ]

    return NextResponse.json(holdings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch holdings' }, { status: 500 })
  }
}
