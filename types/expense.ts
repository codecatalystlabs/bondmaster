export interface Expense {
    company_id: number;
    description: string;
    currency: string;
    amount: any;
    expense_date: string;
    created_by: string;
    updated_by: string
}



export interface ExpenseResponse {
  ID: number;
  CreatedAt: string; 
  UpdatedAt: string; 
  DeletedAt: string | null;  
  company_id: number;
  description: string;
  currency: string;
  amount: number;
  expense_date: string; 
  created_by: string;
  updated_by: string;
  company: Company;
}

export interface Company {
  ID: number;
  CreatedAt: string; 
  UpdatedAt: string; 
  DeletedAt: string | null;  
  company_uuid: string; 
  name: string;
  start_date: string; 
  created_by: string;
  updated_by: string;
}
