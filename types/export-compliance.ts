import { Car } from './car'

export interface ComplianceCheck {
  id: string
  carId: string
  checkType: 'age' | 'emissions' | 'documentation'
  status: 'pass' | 'fail'
  message: string
}

export interface InspectionReport {
  id: string
  carId: string
  inspectionDate: string
  roadworthiness: 'pass' | 'fail'
  emissionsCompliance: 'pass' | 'fail'
  notes: string
}

export interface ComplianceCertificate {
  id: string
  carId: string
  issueDate: string
  expiryDate: string
  certificateNumber: string
}

export interface ExportReadyCar extends Car {
  complianceChecks: ComplianceCheck[]
  inspectionReport?: InspectionReport
  complianceCertificate?: ComplianceCertificate
  mileage: number
  price: number
  condition: 'good' | 'fair' | 'poor'
  exportStatus: 'pending' | 'flagged' | 'ready'
  createdAt: string
  updatedAt: string
}




