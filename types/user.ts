export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  password: string;
}

export interface LoginUser {
  identity: string;  
  password: string;
}

export interface UserInfo {
  username: string;
  email: string;
  password: string;
  company_id?: number;
  surname: string;
  firstname: string;
  gender: string;
  title: string;
  created_by: string;
  updated_by: string;
  user_groups: any;
}


export interface UserResponseInfo {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  user_uuid: string;
  surname: string;
  firstname: string;
  othername: string;
  gender: string;
  title: string;
  username: string;
  email: string;
  password: string;
  company_id: number;
  company: Company;
  created_by: string;
  updated_by: string;
  user_groups: any;
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

