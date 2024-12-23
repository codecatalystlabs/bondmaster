"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShippingDashboard } from "./shipping-dashboard"
import { ShippingCompanyManagement } from "./shipping-company-management"
import { ScheduleManagement } from "./schedule-management"
import { BookingManagement } from "./booking-management"
import { DocumentManagement } from "./document-management"
import { AnalyticsReporting } from "./analytics-reporting"

export function ShippingLogistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Logistics</CardTitle>
        <CardDescription>
          Manage shipping schedules, bookings, and track shipments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="companies">Shipping Companies</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <ShippingDashboard />
          </TabsContent>
          <TabsContent value="companies">
            <ShippingCompanyManagement />
          </TabsContent>
          <TabsContent value="schedules">
            <ScheduleManagement />
          </TabsContent>
          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsReporting />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

