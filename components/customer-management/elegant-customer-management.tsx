"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Car } from "@/types/car";

// This would typically come from an API or database
const mockCars: Car[] = [
	{
		ID: 23,
		car_uuid: "858e9bed-6b3e-4252-98cf-05ab95aa18de",
		make: "Grab",
		model: "Grab",
		manufacture_year: 2025,
		vin_number: "2311244123412341234",
		bid_price: 12334,
		currency: "USD",
		expenses: [
			{
				ID: 5,
				amount: 34343,
				currency: "Ugandan Shilling",
				description: "Pay for testing fuel",
			},
			{
				ID: 6,
				amount: 900000,
				currency: "Ugandan Shilling",
				description: "server",
			},
		],
	},
	// Add more mock cars here...
];

export function ElegantCostManagement() {
	const [selectedCar, setSelectedCar] = useState<Car | null>(null);
	const [totalCost, setTotalCost] = useState<number>(0);

	useEffect(() => {
		if (selectedCar) {
			const carCost = selectedCar.bid_price;
			const expensesCost = 100
				
			setTotalCost(carCost + expensesCost);
		}
	}, [selectedCar]);

	const handleCarSelect = (carId: string) => {
		const car = mockCars.find((c) => c.car_uuid === carId);
		setSelectedCar(car || null);
	};

	const generatePDF = () => {
		// This would typically call an API to generate the PDF
		console.log("Generating PDF for car:", selectedCar?.car_uuid);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Cost Management</h1>
			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Select a Car</CardTitle>
				</CardHeader>
				<CardContent>
					<Select onValueChange={handleCarSelect}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a car" />
						</SelectTrigger>
						<SelectContent>
							{mockCars.map((car) => (
								<SelectItem
									key={car.car_uuid}
									value={car.car_uuid}
								>
									{car.make} {car.model} (
									{car.manufacture_year})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			{selectedCar && (
				<Card>
					<CardHeader>
						<CardTitle>
							{selectedCar.make} {selectedCar.model}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Car Details
								</h3>
								<p>
									<strong>Year:</strong>{" "}
									{selectedCar.manufacture_year}
								</p>
								<p>
									<strong>VIN:</strong>{" "}
									{selectedCar.vin_number}
								</p>
								<p>
									<strong>Bid Price:</strong>{" "}
									{selectedCar.currency}{" "}
									{selectedCar.bid_price.toLocaleString()}
								</p>
								<p>
									<strong>Total Cost:</strong> USD{" "}
									{totalCost.toLocaleString(
										undefined,
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}
									)}
								</p>
							</div>
							<div className="flex justify-center items-center">
								<QRCodeSVG
									value={`https://yourapp.com/car-pdf/${selectedCar.car_uuid}`}
									size={200}
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button onClick={generatePDF}>
							Generate PDF
						</Button>
					</CardFooter>
				</Card>
			)}
		</div>
	);
}
