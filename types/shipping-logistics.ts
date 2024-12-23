import { Car } from './car'

export interface ShippingCompany {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  shippingRoutes: string[]
  rates: {
    route: string
    rate: number
  }[]
}

export interface ShippingSchedule {
  id: string
  shippingCompanyId: string
  vesselName: string
  departurePort: string
  destinationPort: string
  departureTime: string
  estimatedArrivalTime: string
  status: 'scheduled' | 'in-transit' | 'arrived' | 'delayed'
}

export interface Booking {
  id: string
  scheduleId: string
  carIds: string[]
  containerNumber?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  documents: {
    type: 'bill-of-lading' | 'booking-confirmation' | 'packing-list' | 'shipping-manifest'
    url: string
  }[]
}

export interface ShippingCost {
  bookingId: string
  baseRate: number
  additionalFees: {
    type: string
    amount: number
  }[]
  totalCost: number
}

export interface Notification {
  id: string
  type: 'booking-confirmation' | 'departure-update' | 'arrival-update' | 'schedule-change' | 'customs-reminder'
  message: string
  date: string
  read: boolean
}

