import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Car } from "@/types/car"

interface CarDetailsModalProps {
  car: Car | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CarDetailsModal({ car, open, onOpenChange }: CarDetailsModalProps) {
  if (!car) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{car.make} {car.model} ({car.year})</DialogTitle>
          <DialogDescription>
            Detailed information about the vehicle.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">VIN Number</h4>
              <p>{car.vin_number}</p>
            </div>
            <div>
              <h4 className="font-semibold">Make</h4>
              <p>{car.make}</p>
            </div>
            <div>
              <h4 className="font-semibold">Model</h4>
              <p>{car.model}</p>
            </div>
            <div>
              <h4 className="font-semibold">Year</h4>
              <p>{car.year}</p>
            </div>
            <div>
              <h4 className="font-semibold">Bid Price</h4>
              <p>{new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: car.currency,
              }).format(car.bid_price)}</p>
            </div>
            <div>
              <h4 className="font-semibold">VAT Tax</h4>
              <p>{new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: car.currency,
              }).format(car.vat_tax)}</p>
            </div>
            <div>
              <h4 className="font-semibold">Purchase Date</h4>
              <p>{new Date(car.purchase_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-semibold">Destination</h4>
              <p>{car.destination}</p>
            </div>
            <div>
              <h4 className="font-semibold">From Company ID</h4>
              <p>{car.from_company_id || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold">To Company ID</h4>
              <p>{car.to_company_id || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold">Customer ID</h4>
              <p>{car.customer_id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

