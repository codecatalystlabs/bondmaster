export interface Customer {
  ID: number;
  id?: number;
  customer_id?: number;
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


export type DataItem = {
  addresses: any[];
  customer: CustomerResponse;
  customer_ports: any[]
}

export interface NewCustomer extends Omit<Customer, 'ID' | 'id' | 'customer_id'> {
  // Any additional fields specific to new customers could go here
}
