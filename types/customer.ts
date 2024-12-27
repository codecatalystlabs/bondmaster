export interface Customer {
  customer_uuid?: string;
  surname: string;
  firstname: string;
  othername?: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  age: number;
  dob: string;
  telephone: string;
  email: string;
  nin: string;
  created_by: string;
  updated_by: string;
}

export interface CustomerResponse {
  ID: number;
  CreatedAt: string; 
  UpdatedAt: string; 
  DeletedAt: string | null; 
  customer_uuid: string;
  surname: string;
  firstname: string;
  othername: string;
  gender: string;
  nationality: string;
  age: number;
  dob: string; 
  telephone: string;
  email: string;
  nin: string;
  created_by: string;
  updated_by: string;
}
