export interface CarDocument {
  id: string
  name: string
  type: 'photo' | 'inspection' | 'logbook' | 'history'
  url: string
  uploadedAt: string
}

export interface Car {
  car_uuid: string;
  vin_number: string;
  make: string;
  model: string;
  year: number;
  currency: string;
  bid_price: number;
  vat_tax: number;
  purchase_date: string;
  destination: string;
  from_company_id?: number | null;
  to_company_id?: number | null;
  customer_id?: number | null;
  created_by: string;
  updated_by: string;
}


export interface CarResponse {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  car_uuid: string;
  vin_number: string;
  make: string;
  model: string;
  year: number;
  currency: string;
  bid_price: number;
  vat_tax: number;
  purchase_date: string;
  from_company_id?: number | null;
  from_company?: string | null;
  to_company_id?: number | null;
  to_company?: string | null;
  destination: string;
  customer_id?: number | null;
  customer?: string | null;
  created_by: string;
  updated_by: string;
}
