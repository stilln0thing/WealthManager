"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Shield, Target } from 'lucide-react'

interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercent: number
  topPerformer: {
    symbol: string
    name: string
    gainPercent: number
  }
  worstPerformer: {
    symbol: string
    name: string
    gainPercent: number
  }
  diversificationScore: number
  riskLevel: string
}

interface TopPerformersProps {
  summary: PortfolioSummary
}

export function TopPerformers({ summary }: TopPerformersProps) {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getDiversificationColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {summary.topPerformer.symbol}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.topPerformer.name}
          </p>
          <p className="text-sm font-medium text-green-600 mt-1">
            +{summary.topPerformer.gainPercent}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Worst Performer</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {summary.worstPerformer.symbol}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.worstPerformer.name}
          </p>
          <p className="text-sm font-medium text-red-600 mt-1">
            {summary.worstPerformer.gainPercent}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diversification Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getDiversificationColor(summary.diversificationScore)}`}>
            {summary.diversificationScore}/10
          </div>
          <p className="text-xs text-muted-foreground">
            Portfolio spread across sectors
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Badge className={getRiskColor(summary.riskLevel)}>
            {summary.riskLevel}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Based on portfolio composition
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
