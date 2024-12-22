import { Car } from './car'

export interface ShippingContainer {
    id: string
    name: string
    maxCapacity: number
    dimensions: {
        length: number
        width: number
        height: number
    }
    maxWeight: number
}

export interface ShippingOrderItem {
    car: Car
    quantity: number
}

export interface ShippingOrder {
    id: string
    orderNumber: string
    items: ShippingOrderItem[]
    container: ShippingContainer | null
    status: 'pending' | 'processing' | 'shipped'
    createdAt: string
    updatedAt: string
}

