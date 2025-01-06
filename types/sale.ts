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

