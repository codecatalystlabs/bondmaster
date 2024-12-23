"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CarEntryForm } from "./car-entry-form"
import { ComplianceCheckResults } from "./compliance-check-results"
import { ExportReadyCar } from "@/types/export-compliance"
import { InspectionIntegration } from "./inspection-integration"
import { FinalApproval } from "./final-approval"


export function ExportCompliance() {
  const [cars, setCars] = React.useState<ExportReadyCar[]>([])

  const addCar = (car: ExportReadyCar) => {
    setCars([...cars, car])
  }

  const updateCar = (updatedCar: ExportReadyCar) => {
    setCars(cars.map(car => car.id === updatedCar.id ? updatedCar : car))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Compliance</CardTitle>
        <CardDescription>
          Manage export compliance for vehicles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="entry" className="space-y-4">
          <TabsList>
            <TabsTrigger value="entry">Car Entry</TabsTrigger>
            <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
            <TabsTrigger value="inspection">Inspection</TabsTrigger>
            <TabsTrigger value="approval">Final Approval</TabsTrigger>
          </TabsList>
          <TabsContent value="entry">
            <CarEntryForm onSubmit={addCar} />
          </TabsContent>
          <TabsContent value="checks">
            <ComplianceCheckResults cars={cars} onUpdate={updateCar} />
          </TabsContent>
          <TabsContent value="inspection">
            <InspectionIntegration cars={cars} onUpdate={updateCar} />
          </TabsContent>
          <TabsContent value="approval">
            <FinalApproval cars={cars} onUpdate={updateCar} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

