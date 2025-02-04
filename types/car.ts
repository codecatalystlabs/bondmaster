export interface CarDocument {
  id: string
  name: string
  type: 'photo' | 'inspection' | 'logbook' | 'history'
  url: string
  uploadedAt: string
}

export interface Car {
  ID?: any;
  car_uuid: string;
  vin_number: string;
  engine_number: string;
  engine_capacity: string;
  make: string;
  model: string;
  maxim_carry: number;
  weight: number;
  gross_weight: number;
  length: number;
  width: number;
  height: number;
  manufacture_year: number;
  first_registration_year: number;
  transmission: string;
  body_type: string;
  colour: string;
  auction: string;
  currency: string;
  millage: number;
  fuel_consumption: string;
  ps: boolean;
  pw: boolean;
  abs: boolean;
  ads: boolean;
  aw: boolean;
  sw: boolean;
  navigation: boolean;
  ac: boolean;
  bid_price: number;
  purchase_date: string;
  from_company_id: number;
  to_company_id: number;
  destination: string;
  port: string;
  broker_name: string;
  broker_number: string;
  vat_tax: number | null;
  number_plate: string;
  customer_id: number | null;
  car_status: string;
  car_payment_status: string;
  created_by: string;
  updated_by: string;
}


// export interface Car {
//   ID?: string;
//   car_uuid: string;
//   vin_number: string;
//   engine_number: string;
//   engine_capacity: string;
//   make: string;
//   model: string;
//   maxim_carry: number;
//   weight: number;
//   gross_weight: number;
//   ff_weight: number;
//   rr_weight: number;
//   fr_weight: number;
//   rf_weight: number;
//   weight_units: string;
//   length: number;
//   width: number;
//   height: number;
//   length_units: string;
//   maunufacture_year: number;
//   first_registration_year: number;
//   transmission: string;
//   body_type: string;
//   colour: string;
//   auction: string;
//   currency: string;
//   bid_price: number;
//   purchase_date: string;
//   from_company_id: number;
//   to_company_id: number;
//   destination: string;
//   broker_name: string;
//   broker_number: string;
//   vat_tax: number;
//   number_plate: string;
//   customer_id: number;
//   created_by: string;
//   updated_by: string;
// }



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




export interface CarExpense {
  ID: number;
  CreatedAt: string; 
  UpdatedAt: string; 
  DeletedAt: string | null; 
  car_id: number;
  description: string;
  currency: string;
  amount: number;
  expense_date: string; 
  created_by: string;
  updated_by: string;
  car: Car;
}