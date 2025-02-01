import { CarInventory } from "@/components/cars/car-inventory";

export default function CarInventoryPage() {
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">
				Car Inventory Management
			</h1>
			<CarInventory />
		</div>
	);
}
