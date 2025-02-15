"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
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
import useSWR, { mutate } from "swr";
import { addCarExpenses, fetcher } from "@/apis";
import type { Car } from "@/types/car";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import useUserStore from "@/app/store/userStore";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";
import { CarExpenseModal } from "../cars/car-expense-modal";


export function SingleCarExpense() {
	const { data: carList } = useSWR("/cars", fetcher);
    const user = useUserStore((state) => state.user);

    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    



 
    const {
		data: expenseData,
		error,
		isLoading,
    } = useSWR(selectedCar ? `/car/${selectedCar.ID}/expenses` : null, fetcher);


	const handleCarSelect = (carJson: string) => {
		try {
			const car = JSON.parse(carJson);
			setSelectedCar(car);
		} catch (error) {
			console.error("Error parsing selected car:", error);
		}
	};

	const handleCarExpenseSubmit = async (data: any) => {
		const newExpense: any = {
			...data,
			car_id: selectedCar?.ID || 1,
			created_by: user?.username,
			updated_by: user?.username,
		};

		try {
			const response = await addCarExpenses({
				url: `${BASE_URL}/car/expense`,
				expense: newExpense,
			});

		

			mutate(`/car/${selectedCar?.ID}/expenses`);
			toast.success("Expense added successfully");
		} catch (error) {
			console.error("Failed to add expense:", error);
			toast.error("Failed to add expense");
		}
	};


	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">
				Car Expense Management
			</h1>
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
							{carList?.data?.map(
								(car: any, index: any) => (
									<SelectItem
										key={index}
										value={JSON.stringify(
											car?.car
										)}
									>
										{car?.car?.car_make}{" "}
										{car?.car.car_model})- (
										{car?.car.colour}) -(
										{car?.car.engine_capacity}) -
										({car?.car.manufacture_year})
										- ({car?.car.chasis_number})
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			{selectedCar && (
				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle>
							{selectedCar?.car_make}{" "}
							{selectedCar?.car_model} -{" "}
							{selectedCar?.chasis_number}
						</CardTitle>
						<Button onClick={() => setShowExpenseModal(true)}>
							Add Expense
						</Button>
					</CardHeader>
					<CardContent>
						<div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											Description
										</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{expenseData?.data.map(
										(
											expense: any,
											index: any
										) => (
											<TableRow key={index}>
												<TableCell>
													{
														expense?.description
													}
												</TableCell>
												<TableCell>
													{
														expense?.currency
													}{" "}
													{
														expense?.amount
													}
												</TableCell>
												<TableCell>
													{new Date(
														expense?.expense_date
													).toLocaleDateString()}
												</TableCell>
											</TableRow>
										)
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
					<CarExpenseModal
						carId={selectedCar?.ID || ""}
						open={showExpenseModal}
						onOpenChange={setShowExpenseModal}
						onSubmit={handleCarExpenseSubmit}
					/>
				</Card>
			)}
		</div>
	);
}
