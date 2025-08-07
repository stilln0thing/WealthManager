"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { AllocationCharts } from "@/components/allocation-charts"
import { HoldingsTable } from "@/components/holdings-table"
import { PerformanceChart } from "@/components/performance-chart"
import { TopPerformers } from "@/components/top-performers"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { apiService, type Holding, type AllocationData, type PerformanceData, type PortfolioSummary } from "@/lib/api"

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [allocation, setAllocation] = useState<AllocationData | null>(null)
  const [performance, setPerformance] = useState<PerformanceData | null>(null)
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching portfolio data...')

        const [holdingsData, allocationData, performanceData, summaryData] = await Promise.all([
          apiService.getHoldings(),
          apiService.getAllocation(),
          apiService.getPerformance(),
          apiService.getSummary()
        ])

        console.log('Fetched data:', {
          holdings: holdingsData.length,
          allocation: Object.keys(allocationData.bySector).length,
          performance: performanceData.timeline?.length || 0,
          summary: summaryData.totalValue
        })

        setHoldings(holdingsData)
        setAllocation(allocationData)
        setPerformance(performanceData)
        setSummary(summaryData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
          <Skeleton className="h-96" />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading portfolio data: {error}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  if (!summary || !allocation || !performance) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Portfolio Overview Cards */}
        <PortfolioOverview summary={summary} holdingsCount={holdings.length} />

        {/* Top Performers Section */}
        <TopPerformers summary={summary} />

        {/* Asset Allocation Charts */}
        <AllocationCharts allocation={allocation} />

        {/* Performance Chart */}
        <PerformanceChart performance={performance} />

        {/* Holdings Table */}
        <HoldingsTable holdings={holdings} />
      </main>
    </div>
  )
}
