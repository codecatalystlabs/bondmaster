"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/chart"

// Mock data for demonstration
const transitTimeData = [
  { month: "Jan", avgDays: 25 },
  { month: "Feb", avgDays: 23 },
  { month: "Mar", avgDays: 26 },
  { month: "Apr", avgDays: 24 },
  { month: "May", avgDays: 25 },
  { month: "Jun", avgDays: 22 },
]

const shippingCostsData = [
  { company: "OceanFreight Ltd", avgCost: 2000 },
  { company: "SeaWays Inc", avgCost: 2200 },
  { company: "Global Shipping Co", avgCost: 1900 },
  { company: "FastSeas Logistics", avgCost: 2100 },
]

export function AnalyticsReporting() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Average Transit Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={transitTimeData}
            categories={["avgDays"]}
            index="month"
            colors={["blue"]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Shipping Costs by Company</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={shippingCostsData}
            categories={["avgCost"]}
            index="company"
            colors={["green"]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

