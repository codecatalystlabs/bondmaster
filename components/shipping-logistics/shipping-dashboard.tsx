"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShippingSchedule } from "@/types/shipping-logistics"

const upcomingShipments: ShippingSchedule[] = [
  {
    id: "1",
    shippingCompanyId: "1",
    vesselName: "Ocean Voyager",
    departurePort: "Yokohama",
    destinationPort: "Mombasa",
    departureTime: "2023-07-15T10:00:00Z",
    estimatedArrivalTime: "2023-08-05T14:00:00Z",
    status: "scheduled",
  },
]

export function ShippingDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vessel</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Estimated Arrival</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.vesselName}</TableCell>
                <TableCell>{`${shipment.departurePort} → ${shipment.destinationPort}`}</TableCell>
                <TableCell>{new Date(shipment.departureTime).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(shipment.estimatedArrivalTime).toLocaleDateString()}</TableCell>
                <TableCell>{shipment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

