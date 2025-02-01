export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}


export interface ICompany {
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


export interface Group {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null; 
  Code: string;
  Name: string;
  Description: string;
  Internal: boolean;
  created_by: string;
  updated_by: string;
  roles: string[] | null; 
}
