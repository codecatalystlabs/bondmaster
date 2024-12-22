export interface CarDocument {
  id: string
  name: string
  type: 'photo' | 'inspection' | 'logbook' | 'history'
  url: string
  uploadedAt: string
}

export interface Car {
  id: string
  make: string
  model: string
  year: number
  chassisNumber: string
  engineCapacity: string
  mileage: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  price: number
  documents: CarDocument[]
  createdAt: string
  updatedAt: string
}

