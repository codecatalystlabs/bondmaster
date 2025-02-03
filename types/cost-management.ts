import { Car } from './car'

export type CostType = 'inspection' | 'cleaning' | 'inland_transport' | 'customs' | 'storage' | 'repairs' | 'documentation' | 'other'

export interface Cost {
  car_id: number
  amount: number
  description: string
  currency: string
  expense_date: string
  created_by: string
  updated_by: string
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


export interface ICurrency {
  ID: number;
  CreatedAt?: string; 
  UpdatedAt?: string; 
  DeletedAt?: string | null;
  name: string;
  symbol: string;
  created_by?: string;
  updated_by?: string;
}

