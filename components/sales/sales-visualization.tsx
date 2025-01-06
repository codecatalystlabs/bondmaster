"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, DoughnutChart } from "@/components/ui/chart"
import { Sale } from "@/types/sale"

interface SalesVisualizationProps {
  sales: Sale[]
}

export function SalesVisualization({ sales }: SalesVisualizationProps) {
  const monthlySales = React.useMemo(() => {
    const salesByMonth: { [key: string]: number } = {}
    sales.forEach((sale) => {
      const month = sale.saleDate.substring(0, 7) // Get YYYY-MM
      salesByMonth[month] = (salesByMonth[month] || 0) + sale.totalPrice
    })
    return Object.entries(salesByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }))
  }, [sales])

  const salesByCompany = React.useMemo(() => {
    const salesByCompany: { [key: string]: number } = {}
    sales.forEach((sale) => {
      const companyName = sale.company.name
      salesByCompany[companyName] = (salesByCompany[companyName] || 0) + sale.totalPrice
    })
    return Object.entries(salesByCompany).map(([company, total]) => ({ company, total }))
  }, [sales])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <LineChart
            data={monthlySales}
            categories={["total"]}
            index="month"
            colors={["blue"]}
            yAxisWidth={60}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sales by Company</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <DoughnutChart
            data={salesByCompany.map((item) => item.total)}
            labels={salesByCompany.map((item) => item.company)}
            colors={["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

