import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Car } from "@/types/car";
import { CarIcon, Info, DollarSign, Truck, User } from "lucide-react";

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
	if (!car) return null;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">
						{car.make} {car.model} (
						{car.maunufacture_year || "N/A"})
					</DialogTitle>
					<DialogDescription>
						Detailed information about the vehicle.
					</DialogDescription>
				</DialogHeader>
				<Tabs
					defaultValue="basic"
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="basic">
							<CarIcon className="w-4 h-4 mr-2" />
							Basic Info
						</TabsTrigger>
						<TabsTrigger value="technical">
							<Info className="w-4 h-4 mr-2" />
							Technical
						</TabsTrigger>
						<TabsTrigger value="financial">
							<DollarSign className="w-4 h-4 mr-2" />
							Financial
						</TabsTrigger>
						<TabsTrigger value="logistics">
							<Truck className="w-4 h-4 mr-2" />
							Logistics
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="basic"
						className="mt-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<InfoItem
								label="VIN Number"
								value={car.vin_number}
							/>
							<InfoItem
								label="Make"
								value={car.make}
							/>
							<InfoItem
								label="Model"
								value={car.model}
							/>
							<InfoItem
								label="Year"
								value={car.maunufacture_year}
							/>
							<InfoItem
								label="Color"
								value={car.colour}
							/>
							<InfoItem
								label="Body Type"
								value={car.body_type}
							/>
						</div>
					</TabsContent>
					<TabsContent
						value="technical"
						className="mt-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<InfoItem
								label="Engine Number"
								value={car.engine_number}
							/>
							<InfoItem
								label="Engine Capacity"
								value={car.engine_capacity}
							/>
							<InfoItem
								label="Transmission"
								value={car.transmission}
							/>
							<InfoItem
								label="Weight"
								value={`${car.weight || "N/A"} ${
									car.weight_units
								}`}
							/>
							<InfoItem
								label="Length"
								value={`${car.length || "N/A"} ${
									car.length_units
								}`}
							/>
							<InfoItem
								label="First Registration Year"
								value={car.first_registration_year}
							/>
						</div>
					</TabsContent>
					<TabsContent
						value="financial"
						className="mt-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<InfoItem
								label="Bid Price"
								value={`${car.currency} ${car.bid_price}`}
							/>
							<InfoItem
								label="VAT Tax"
								value={`${car.currency} ${car.vat_tax}`}
							/>
							<InfoItem
								label="Purchase Date"
								value={new Date(
									car.purchase_date
								).toLocaleDateString()}
							/>
						</div>
					</TabsContent>
					<TabsContent
						value="logistics"
						className="mt-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<InfoItem
								label="Destination"
								value={car.destination}
							/>
							<InfoItem
								label="Broker Name"
								value={car.broker_name}
							/>
							<InfoItem
								label="Broker Number"
								value={car.broker_number}
							/>
							<InfoItem
								label="Number Plate"
								value={car.number_plate}
							/>
							<InfoItem
								label="From Company ID"
								value={car.from_company_id}
							/>
							<InfoItem
								label="To Company ID"
								value={car.to_company_id}
							/>
						</div>
					</TabsContent>
				</Tabs>
				<div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
					<div className="flex items-center">
						<User className="w-4 h-4 mr-2" />
						<span>Created by: {car.created_by || "N/A"}</span>
					</div>
					<div className="flex items-center">
						<User className="w-4 h-4 mr-2" />
						<span>Updated by: {car.updated_by || "N/A"}</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function InfoItem({
	label,
	value,
}: {
	label: string;
	value: string | number | undefined;
}) {
	return (
		<div className="space-y-1">
			<h4 className="text-sm font-medium text-gray-500">{label}</h4>
			<p className="text-base">{value || "N/A"}</p>
		</div>
	);
}
