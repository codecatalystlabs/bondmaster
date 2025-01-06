"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExportReadyCar, InspectionReport } from "@/types/export-compliance"

interface InspectionIntegrationProps {
  cars: ExportReadyCar[]
  onUpdate: (car: ExportReadyCar) => void
}

export function InspectionIntegration({ cars, onUpdate }: InspectionIntegrationProps) {
  const fetchInspectionReport = (car: ExportReadyCar) => {
    // Simulating an API call to fetch inspection report
    const inspectionReport: InspectionReport = {
      id: Math.random().toString(36).substr(2, 9),
      carId: car.ID || "",
      inspectionDate: new Date().toISOString(),
      roadworthiness: Math.random() > 0.2 ? 'pass' : 'fail',
      emissionsCompliance: Math.random() > 0.2 ? 'pass' : 'fail',
      notes: "Inspection completed successfully.",
    }

    const updatedCar: ExportReadyCar = {
      ...car,
      inspectionReport,
      exportStatus: inspectionReport.roadworthiness === 'pass' && inspectionReport.emissionsCompliance === 'pass' ? 'ready' : 'flagged',
    }

    onUpdate(updatedCar)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Make</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Inspection Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.ID}>
            <TableCell>{car.make}</TableCell>
            <TableCell>{car.model}</TableCell>
            <TableCell>{car.maunufacture_year}</TableCell>
            <TableCell>{car.inspectionReport ? `Inspected on ${new Date(car.inspectionReport.inspectionDate).toLocaleDateString()}` : 'Not Inspected'}</TableCell>
            <TableCell>
              <Button onClick={() => fetchInspectionReport(car)}>Fetch Inspection Report</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

