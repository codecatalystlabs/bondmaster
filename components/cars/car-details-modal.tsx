import React from 'react'
import Image from 'next/image'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Car, CarDocument } from "@/types/car"

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
              <h4 className="font-semibold">Chassis Number</h4>
              <p>{car.chassisNumber}</p>
            </div>
            <div>
              <h4 className="font-semibold">Engine Capacity</h4>
              <p>{car.engineCapacity}</p>
            </div>
            <div>
              <h4 className="font-semibold">Mileage</h4>
              <p>{car.mileage.toLocaleString()} km</p>
            </div>
            <div>
              <h4 className="font-semibold">Condition</h4>
              <p className="capitalize">{car.condition}</p>
            </div>
            <div>
              <h4 className="font-semibold">Price</h4>
              <p>{new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(car.price)}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Images</h4>
            <div className="grid grid-cols-3 gap-2">
              {car.documents.filter(doc => doc.type === 'photo').map((photo, index) => (
                <Image 
                  key={index} 
                  src={photo.url} 
                  alt={`${car.make} ${car.model}`} 
                  width={150} 
                  height={150} 
                  className="object-cover rounded"
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Documents</h4>
            <div className="space-y-2">
              {car.documents.filter(doc => doc.type !== 'photo').map((document, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{document.name}</span>
                  <Button asChild variant="outline" size="sm">
                    <a href={document.url} download>Download</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

