import { Car } from './car'
import { Company } from './company';

export interface Installment {
  id: number;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface Sale {
  id: number;
  totalPrice: number;
  saleDate: string;
  carId: number;
  car: Car;
  companyId: number;
  company: Company;
  isFullPayment: boolean;
  paymentPeriod: number;
  installments: Installment[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}


export interface Sale2 {
  id?: number;
  total_price: number; // Matches "total_price" in API object
  sale_date: string; // Matches "sale_date" in API object
  car_id: number; // Matches "carId" in API object
  company_id: number; // Matches "companyId" in API object
  is_full_payment: boolean; // Matches "is_full_payment" in API object
  payment_period: number; // Matches "payment_period" in API object
  created_by: string; // Matches "created_by" in API object
  updated_by: string; // Matches "updated_by" in API object
  created_at?: string; // Optional, can align with database timestamps
  updated_at?: string; // Optional, can align with database timestamps
  deleted_at?: string | null; // Optional, can align with soft delete functionality
}



export interface NewSale {
  id?: string
  car_id: number
  company_id: number
  auction_date: string
  auction:string
  price: number
  vat_tax: number
  recycle_fee:number
  created_by: string
  updated_by: string
}

