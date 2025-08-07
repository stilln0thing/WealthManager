"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface AllocationData {
  bySector: Record<string, { value: number; percentage: number }>
  byMarketCap: Record<string, { value: number; percentage: number }>
}

interface AllocationChartsProps {
  allocation: AllocationData
}

const SECTOR_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'
]

const MARKET_CAP_COLORS = {
  Large: '#0088FE',
  Mid: '#00C49F', 
  Small: '#FFBB28'
}

export function AllocationCharts({ allocation }: AllocationChartsProps) {
  const [activeSectorIndex, setActiveSectorIndex] = useState<number | null>(null)
  const [activeMarketCapIndex, setActiveMarketCapIndex] = useState<number | null>(null)

  const sectorData = Object.entries(allocation.bySector).map(([sector, data], index) => ({
    name: sector,
    value: data.value,
    percentage: data.percentage,
    fill: SECTOR_COLORS[index % SECTOR_COLORS.length]
  }))

  const marketCapData = Object.entries(allocation.byMarketCap)
    .filter(([_, data]) => data.value > 0)
    .map(([cap, data]) => ({
      name: cap,
      value: data.value,
      percentage: data.percentage,
      fill: MARKET_CAP_COLORS[cap as keyof typeof MARKET_CAP_COLORS] || '#8884D8'
    }))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Value: <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: <span className="font-medium text-gray-900 dark:text-gray-100">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (!allocation || !sectorData.length) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sector Distribution</CardTitle>
            <CardDescription>Loading chart data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market Cap Distribution</CardTitle>
            <CardDescription>Loading chart data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            Sector Distribution
          </CardTitle>
          <CardDescription>Portfolio allocation across different sectors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveSectorIndex(index)}
                  onMouseLeave={() => setActiveSectorIndex(null)}
                  label={CustomLabel}
                >
                  {sectorData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      stroke={activeSectorIndex === index ? "#fff" : "none"}
                      strokeWidth={activeSectorIndex === index ? 3 : 0}
                      style={{
                        filter: activeSectorIndex === index ? 'brightness(1.1)' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color }} className="text-sm font-medium">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {sectorData.map((sector, index) => (
              <div 
                key={sector.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onMouseEnter={() => setActiveSectorIndex(index)}
                onMouseLeave={() => setActiveSectorIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sector.fill }}
                  ></div>
                  <span className="text-sm font-medium">{sector.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(sector.value)}</div>
                  <div className="text-xs text-muted-foreground">{sector.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            Market Cap Distribution
          </CardTitle>
          <CardDescription>Portfolio split by market capitalization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={marketCapData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
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
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  onMouseEnter={(_, index) => setActiveMarketCapIndex(index)}
                  onMouseLeave={() => setActiveMarketCapIndex(null)}
                >
                  {marketCapData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      style={{
                        filter: activeMarketCapIndex === index ? 'brightness(1.2)' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {marketCapData.map((cap, index) => (
              <div 
                key={cap.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onMouseEnter={() => setActiveMarketCapIndex(index)}
                onMouseLeave={() => setActiveMarketCapIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cap.fill }}
                  ></div>
                  <span className="text-sm font-medium">{cap.name} Cap</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(cap.value)}</div>
                  <div className="text-xs text-muted-foreground">{cap.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
