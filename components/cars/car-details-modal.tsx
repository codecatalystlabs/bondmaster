import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car } from "@/types/car";

interface CarDetailsModalProps {
	car: Car | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CarDetailsModal({
	car,
	open,
	onOpenChange,
}: CarDetailsModalProps) {
  const [selectedCar, setSelectedCar] = React.useState<Car | null>(null);
  console.log(car, "car");
 
	if (!car) return null;

	return (
	 <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {car.make} {car.model} ({car.maunufacture_year || "N/A"})
          </DialogTitle>
          <DialogDescription>
            Detailed information about the vehicle.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Fields already in the table */}
            <div>
              <h4 className="font-semibold">VIN Number</h4>
              <p>{car.vin_number}</p>
            </div>
            <div>
              <h4 className="font-semibold">Engine Capacity</h4>
              <p>{car.engine_capacity || "N/A"}</p>
            </div>

            {/* Fields not in the table */}
            <div>
              <h4 className="font-semibold">First Registration Year</h4>
              <p>{car.first_registration_year || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Transmission</h4>
              <p>{car.transmission || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Body Type</h4>
              <p>{car.body_type || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Colour</h4>
              <p>{car.colour || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Weight</h4>
              <p>{car.weight || "N/A"} {car.weight_units}</p>
            </div>
            <div>
              <h4 className="font-semibold">Length</h4>
              <p>{car.length || "N/A"} {car.length_units}</p>
            </div>
            <div>
              <h4 className="font-semibold">Destination</h4>
              <p>{car.destination || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Broker Name</h4>
              <p>{car.broker_name || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Broker Number</h4>
              <p>{car.broker_number || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Number Plate</h4>
              <p>{car.number_plate || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Created By</h4>
              <p>{car.created_by || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Updated By</h4>
              <p>{car.updated_by || "N/A"}</p>
            </div>
           
          </div>
        </div>
      </DialogContent>
    </Dialog>
	);
}
