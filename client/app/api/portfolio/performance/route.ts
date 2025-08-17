import { NextResponse } from 'next/server'

const API_BASE =  "http://localhost:3000/api/portfolio" 


export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/performance`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store" // ensures fresh data on each call
    })

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error("Error fetching allocation:", error)
    return NextResponse.json(
      { error: 'Failed to fetch allocation' },
      { status: 500 }
    )
  }
}
