"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search } from 'lucide-react'

interface Holding {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  sector: string
  marketCap: string
  value: number
  gainLoss: number
  gainLossPercent: number
}

interface HoldingsTableProps {
  holdings: Holding[]
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Holding>("symbol")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const handleSort = (field: keyof Holding) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedHoldings = holdings
    .filter(holding => 
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.sector.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
        <CardDescription>Your current stock investments</CardDescription>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search holdings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("symbol")}
                    className="h-auto p-0 font-semibold"
                  >
                    Symbol <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold"
                  >
                    Name <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("quantity")}
                    className="h-auto p-0 font-semibold"
                  >
                    Qty <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("currentPrice")}
                    className="h-auto p-0 font-semibold"
                  >
                    Price <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("value")}
                    className="h-auto p-0 font-semibold"
                  >
                    Value <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("gainLoss")}
                    className="h-auto p-0 font-semibold"
                  >
                    Gain/Loss <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("sector")}
                    className="h-auto p-0 font-semibold"
                  >
                    Sector <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedHoldings.map((holding) => (
                <tr key={holding.symbol} className="border-b hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                  <td className="p-2 font-medium hover:text-primary transition-colors duration-200">{holding.symbol}</td>
                  <td className="p-2 text-sm">{holding.name}</td>
                  <td className="p-2">{holding.quantity}</td>
                  <td className="p-2">{formatCurrency(holding.currentPrice)}</td>
                  <td className="p-2">{formatCurrency(holding.value)}</td>
                  <td className={`p-2 transition-colors duration-200 ${holding.gainLoss >= 0 ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}>
                    <div className="flex flex-col">
                      <span className="font-medium">{formatCurrency(holding.gainLoss)}</span>
                      <span className="text-xs opacity-75">
                        ({holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-sm">{holding.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
