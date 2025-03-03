"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/apis";
import type { Car } from "@/types/car";

export function ElegantCostManagement() {
	const { data: carList } = useSWR("/cars", fetcher);

	const [selectedCar, setSelectedCar] = useState<Car | null>(null);
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [profitOrLoss, setProfitOrLoss] = useState<number>(0);
	const [searchChasis, setSearchChasis] = useState("");

	const { data: searchedCarData, error: searchError } = useSWR(
		searchChasis ? `/car/vin/${searchChasis}` : null,
		fetcher
	);

	const { data: total } = useSWR(
		`/total-car-expense/${selectedCar?.ID}`,
		fetcher
	);

	useEffect(() => {
		if (selectedCar) {
			const expensesCost = 0;
			setTotalExpenses(expensesCost);
			setProfitOrLoss(selectedCar.bid_price - expensesCost);
		}
	}, [selectedCar]);

	const handleSearch = async (value: string) => {
		if (value.length >= 5) {
			try {
				const carData = await fetcher(`/car/vin/${value}`);
				if (carData?.data?.car) {
					setSelectedCar(carData.data.car);
					toast.success("Car found!");
				}
			} catch (error) {
				console.error("Error searching car:", error);
			}
		}
	};

	const debouncedSearch = useCallback(
		debounce((value: string) => handleSearch(value), 500),
		[]
	);

	const handleSearchInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setSearchChasis(value);
		debouncedSearch(value);
	};

	const handleCarSelect = (carJson: string) => {
		try {
			const car = JSON.parse(carJson);
			setSelectedCar(car);
		} catch (error) {
			console.error("Error parsing selected car:", error);
		}
	};

	const generatePDF = () => {
		console.log("Generating PDF for car:", selectedCar?.car_uuid);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Cost Management</h1>
			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Search Car</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Input
							placeholder="Search by chassis/VIN number..."
							value={searchChasis}
							onChange={handleSearchInputChange}
							className="max-w-md"
						/>
					</div>
					{!selectedCar && (
						<div>
							<p className="text-sm text-muted-foreground mb-2">
								Or select from list:
							</p>
							<Select onValueChange={handleCarSelect}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a car" />
								</SelectTrigger>
								<SelectContent>
									{carList?.data?.map(
										(car: any, index: any) => (
											<SelectItem
												key={index}
												value={JSON.stringify(
													car?.car
												)}
											>
												{car?.car?.car_make}{" "}
												{car?.car.car_model}{" "}
												- ({car?.car.colour}
												) - (
												{
													car?.car
														.engine_capacity
												}
												) - (
												{
													car?.car
														.manufacture_year
												}
												) - (
												{
													car?.car
														.chasis_number
												}
												)
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>
					)}
				</CardContent>
			</Card>

			{selectedCar && (
				<Card>
					<CardHeader>
						<CardTitle>
							{selectedCar?.car_make}{" "}
							{selectedCar?.car_model}
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
									<strong>Chassis Number:</strong>{" "}
									{selectedCar?.chasis_number}
								</p>
								<p>
									<strong>VAT:</strong> {" JPY "}
									{total?.data?.vat_tax?.toLocaleString()}
								</p>
								<p>
									<strong>Bid Price:</strong>{" "}
									{" JPY "}
									{total?.data?.bid_price?.toLocaleString()}
								</p>
								<p>
									<strong>
										Total Car Expenses:
									</strong>{" "}
									{" JPY "}
									{total?.data?.total_expense_japan?.toLocaleString()}
								</p>

								<p>
									<strong>Total Car Price :</strong>{" "}
									{" JPY "}
									{total?.data?.total_car_price_japan?.toLocaleString()}
								</p>
								<p>
									<strong>
										Total Car Price and Expense:
									</strong>{" "}
									{" JPY "}
									{total?.data?.total_car_price_and_expenses_japan?.toLocaleString()}
								</p>
							</div>
							<div className="flex justify-center items-center">
								<QRCodeSVG
									value={`http://192.168.0.13:3000/car-pdf/${selectedCar.car_uuid}`}
									size={200}
								/>
							</div>
						</div>
					</CardContent>
					{/* <CardFooter>
						<Button onClick={generatePDF}>
							Generate PDF
						</Button>
					</CardFooter> */}
				</Card>
			)}
		</div>
	);
}
