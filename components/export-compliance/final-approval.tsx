"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ComplianceCertificate, ExportReadyCar } from "@/types/export-compliance"

interface FinalApprovalProps {
  cars: ExportReadyCar[]
  onUpdate: (car: ExportReadyCar) => void
}

export function FinalApproval({ cars, onUpdate }: FinalApprovalProps) {
  const generateComplianceCertificate = (car: ExportReadyCar) => {
    const certificate: ComplianceCertificate = {
      id: Math.random().toString(36).substr(2, 9),
      carId: car.ID || '',
      issueDate: new Date().toISOString(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      certificateNumber: `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    }

    const updatedCar: ExportReadyCar = {
      ...car,
      complianceCertificate: certificate,
      exportStatus: 'ready',
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
          <TableHead>Export Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.ID}>
            <TableCell>{car.car_make}</TableCell>
            <TableCell>{car.car_model}</TableCell>
            <TableCell>{car.manufacture_year}</TableCell>
            <TableCell>{car.exportStatus}</TableCell>
            <TableCell>
              {car.exportStatus === 'ready' && !car.complianceCertificate ? (
                <Button onClick={() => generateComplianceCertificate(car)}>Generate Certificate</Button>
              ) : car.complianceCertificate ? (
                `Certificate: ${car.complianceCertificate.certificateNumber}`
              ) : (
                'Not Ready'
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

