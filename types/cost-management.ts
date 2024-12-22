import { Car } from './car'

export type CostType = 'inspection' | 'cleaning' | 'inland_transport' | 'customs' | 'storage' | 'repairs' | 'documentation' | 'other'

export interface Cost {
  id: string
  carId: string
  type: CostType
  amount: number
  description: string
  date: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  buyerId: string
  buyerName: string
  cars: Car[]
  costs: Cost[]
  totalAmount: number
  status: 'draft' | 'sent' | 'paid'
  createdAt: string
  dueDate: string
}

export interface CostCategory {
  id: string
  name: string
}

