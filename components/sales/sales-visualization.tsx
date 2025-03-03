"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/chart"
import { Sale } from "@/types/sale"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SalesVisualizationProps {
  sales: Sale[]
}

export function SalesVisualization({ sales }: SalesVisualizationProps) {
  console.log(sales, "am the sales data")

  const monthlySales = React.useMemo(() => {
    const salesByMonth: { [key: string]: number } = {}

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    for (let i = 0; i < 12; i++) {
      salesByMonth[monthNames[i]] = 0
    }

    sales.forEach((sale: any) => {
      if (sale.sale_date) {
        const date = new Date(sale.sale_date)
        const month = monthNames[date.getMonth()]
        salesByMonth[month] += sale.total_price || 0
      }
    })

    return Object.entries(salesByMonth).map(([month, total]) => ({
      month,
      total: total || 0, // Ensure zero when no sales
    }))
  }, [sales])

  return (
    <div className="grid gap-4 p-20">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
             <ResponsiveContainer width="85%" height={300}>
     <BarChart data={monthlySales}>
        <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="month" />
         <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total Sales" />
       </BarChart>
    </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}



