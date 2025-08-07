"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface PerformanceData {
  timeline: Array<{
    date: string
    portfolio: number
    nifty50: number
    gold: number
  }>
  returns: {
    portfolio: { "1month": number; "3months": number; "1year": number }
    nifty50: { "1month": number; "3months": number; "1year": number }
    gold: { "1month": number; "3months": number; "1year": number }
  }
}

interface PerformanceChartProps {
  performance: PerformanceData
}

export function PerformanceChart({ performance }: PerformanceChartProps) {
  const [activeDataKey, setActiveDataKey] = useState<string | null>(null)

  const chartData = performance.timeline.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    fullDate: new Date(item.date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{data.fullDate}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm font-medium capitalize">{entry.dataKey}</span>
                </div>
                <span className="font-semibold">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getReturnIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  if (!performance || !chartData.length) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>Loading chart data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Performance Comparison
          </CardTitle>
          <CardDescription>Portfolio performance vs benchmarks over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm"
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  axisLine={false}
                  tickLine={false}
                  className="text-sm"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-sm font-medium capitalize">{value}</span>
                  )}
                />
                
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#0088FE"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0088FE' }}
                  activeDot={{ r: 6, stroke: '#0088FE', strokeWidth: 2, fill: '#fff' }}
                  onMouseEnter={() => setActiveDataKey('portfolio')}
                  onMouseLeave={() => setActiveDataKey(null)}
                />
                <Line
                  type="monotone"
                  dataKey="nifty50"
                  stroke="#00C49F"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00C49F' }}
                  activeDot={{ r: 6, stroke: '#00C49F', strokeWidth: 2, fill: '#fff' }}
                  onMouseEnter={() => setActiveDataKey('nifty50')}
                  onMouseLeave={() => setActiveDataKey(null)}
                />
                <Line
                  type="monotone"
                  dataKey="gold"
                  stroke="#FFBB28"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FFBB28' }}
                  activeDot={{ r: 6, stroke: '#FFBB28', strokeWidth: 2, fill: '#fff' }}
                  onMouseEnter={() => setActiveDataKey('gold')}
                  onMouseLeave={() => setActiveDataKey(null)}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-md hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Portfolio Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(performance.returns.portfolio).map(([period, value]) => (
              <div key={period} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground capitalize">
                  {period.replace('month', ' Month').replace('year', ' Year')}
                </span>
                <div className={`flex items-center gap-1 font-medium ${getReturnColor(value)}`}>
                  {getReturnIcon(value)}
                  <span>{value >= 0 ? '+' : ''}{value}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Nifty 50 Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(performance.returns.nifty50).map(([period, value]) => (
              <div key={period} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground capitalize">
                  {period.replace('month', ' Month').replace('year', ' Year')}
                </span>
                <div className={`flex items-center gap-1 font-medium ${getReturnColor(value)}`}>
                  {getReturnIcon(value)}
                  <span>{value >= 0 ? '+' : ''}{value}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Gold Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(performance.returns.gold).map(([period, value]) => (
              <div key={period} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm text-muted-foreground capitalize">
                  {period.replace('month', ' Month').replace('year', ' Year')}
                </span>
                <div className={`flex items-center gap-1 font-medium ${getReturnColor(value)}`}>
                  {getReturnIcon(value)}
                  <span>{value >= 0 ? '+' : ''}{value}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
