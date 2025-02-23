"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import {
	addCarExpenses,
	fetcher,
	updateExpense,
	deleteCarExpense,
} from "@/apis";
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
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";
import { formatAmount } from "@/lib/utils";
import { debounce } from "lodash";

export function SingleCarExpense() {
	const { data: carList } = useSWR("/cars", fetcher);
	const user = useUserStore((state) => state.user);

	const [selectedCar, setSelectedCar] = useState<Car | null>(null);
	const [showExpenseModal, setShowExpenseModal] = useState(false);

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const [searchChasis, setSearchChasis] = useState("");

	const [editingExpense, setEditingExpense] = useState<any>(null);

	// Add new state for direct car search
	const [searchedCar, setSearchedCar] = useState<Car | null>(null);

	// Add new SWR hook for chassis search
	const { data: searchedCarData, error: searchError } = useSWR(
		searchChasis ? `/car/vin/${searchChasis}` : null,
		fetcher
	);
	console.log(searchedCarData, "searchedCarData");

	// Filter cars based on chassis number search
	const filteredCars = carList?.data?.filter((car: any) =>
		car?.car?.chasis_number
			?.toLowerCase()
			.includes(searchChasis.toLowerCase())
	);

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
			created_by: user?.username,
			updated_by: user?.username,
		};

		try {
			const response = await addCarExpenses({
				url: `${BASE_URL}/car/expense`,
				expense: newExpense,
			});

			// Immediately revalidate the data
			await Promise.all([
				mutate(`/car/${selectedCar?.ID}/expenses`),
				mutate(
					`/car/${selectedCar?.ID}/expenses?page=${page}&limit=${limit}&search=${searchChasis}`
				),
			]);

			setShowExpenseModal(false);
			toast.success("Expense added successfully");
		} catch (error) {
			console.error("Failed to add expense:", error);
			toast.error("Failed to add expense");
		}
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		mutate(
			`/car/${selectedCar?.ID}/expenses?page=${newPage}&limit=${limit}&search=${searchChasis}`
		);
	};

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
		setPage(1);
		mutate(
			`/car/${selectedCar?.ID}/expenses?page=1&limit=${newLimit}&search=${searchChasis}`
		);
	};

	// Update handleSearch to handle direct car lookup
	const handleSearch = async (value: string) => {
		setSearchChasis(value);

		if (value.length >= 5) {
			try {
				const carData = await fetcher(`/car/vin/${value}`);
				if (carData?.data?.car) {
					setSelectedCar(carData.data.car);
					// Update the expenses data in the SWR cache
					mutate(
						`/car/${carData.data.car.ID}/expenses`,
						{ data: carData.data.expenses },
						false
					);
					toast.success("Car found!");
				}
			} catch (error) {
				console.error("Error searching car:", error);
			}
		}
	};

	// Debounce the search to prevent too many API calls
	const debouncedSearch = React.useCallback(
		debounce((value: string) => handleSearch(value), 500),
		[]
	);

	// Update the search input handler
	const handleSearchInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setSearchChasis(value);
		debouncedSearch(value);
	};

	const {
		data: expenseData,
		error,
		isLoading,
	} = useSWR<{ data: any[]; total: number }>(
		selectedCar
			? `/car/${selectedCar.ID}/expenses?page=${page}&limit=${limit}&search=${searchChasis}`
			: null,
		fetcher
	);

	const totalPages = Math.ceil(
		(expenseData?.total || expenseData?.data?.length || 0) / limit
	);
	const startIndex = (page - 1) * limit + 1;
	const endIndex = Math.min(page * limit, expenseData?.total || 0);

	const handleEditExpense = async (updatedExpense: any) => {
		try {
			const response = await updateExpense({
				url: `car/expense/${updatedExpense.ID}`,
				expense: {
					...updatedExpense,
					updated_by: user?.username,
				},
			});

			if (response) {
				toast.success("Expense updated successfully");
				mutate(`/car/${selectedCar?.ID}/expenses`);
				setEditingExpense(null);
			} else {
				toast.error("Failed to update expense");
			}
		} catch (error) {
			console.error("Failed to update expense:", error);
			toast.error("Failed to update expense");
		}
	};

	const handleDeleteExpense = async (expenseId: number) => {
		if (!confirm("Are you sure you want to delete this expense?")) return;

		try {
			const response = await deleteCarExpense({ expenseId });

			if (response) {
				// Revalidate all relevant data
				await Promise.all([
					mutate(`/car/${selectedCar?.ID}/expenses`),
					mutate(
						`/car/${selectedCar?.ID}/expenses?page=${page}&limit=${limit}&search=${searchChasis}`
					),
					mutate(`/car/vin/${searchChasis}`),
				]);

				toast.success("Expense deleted successfully");
			} else {
				toast.error("Failed to delete expense");
			}
		} catch (error) {
			console.error("Failed to delete expense:", error);
			toast.error("Failed to delete expense");
		}
	};

	return (
		<div className="container mx-auto ">
			<h1 className="text-xl font-bold mb-4">
				Car Expense Management
			</h1>
			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Search Car By Chasis Number </CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex gap-4">
							<Input
								placeholder="Search by chassis number..."
								value={searchChasis}
								onChange={handleSearchInputChange}
								className="max-w-sm"
							/>
						</div>
						{/* Only show select if no car is found through search */}
						{!selectedCar && (
							<Select onValueChange={handleCarSelect}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a car" />
								</SelectTrigger>
								<SelectContent>
									{filteredCars?.map(
										(car: any, index: any) => (
											<SelectItem
												key={index}
												value={JSON.stringify(
													car?.car
												)}
											>
												(
												{car?.car?.car_make}{" "}
												{car?.car.car_model}
												)- (
												{car?.car.colour})
												-(
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
						)}
					</div>
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
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{searchedCarData?.data?.expenses
										?.length > 0
										? searchedCarData.data.expenses.map(
												(
													expense: any,
													index: any
												) => (
													<TableRow
														key={
															index
														}
													>
														<TableCell>
															{
																expense.description
															}
														</TableCell>
														<TableCell>
															{formatAmount(
																expense.amount,
																expense.currency
															)}
														</TableCell>
														<TableCell>
															{new Date(
																expense.expense_date
															).toLocaleDateString()}
														</TableCell>
														<TableCell>
															<div className="flex gap-2">
																{!editingExpense?.ID ===
																	expense.ID && (
																	<>
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				setEditingExpense(
																					expense
																				)
																			}
																		>
																			<Edit2 className="h-4 w-4" />
																		</Button>
																		<Button
																			variant="destructive"
																			size="sm"
																			onClick={() =>
																				handleDeleteExpense(
																					expense.ID
																				)
																			}
																		>
																			<Trash2 className="h-4 w-4" />
																		</Button>
																	</>
																)}
															</div>
														</TableCell>
													</TableRow>
												)
										  )
										: expenseData?.data?.map(
												(
													expense: any,
													index: any
												) => (
													<TableRow
														key={
															index
														}
													>
														<TableCell>
															{editingExpense?.ID ===
															expense.ID ? (
																<Input
																	value={
																		editingExpense.description
																	}
																	onChange={(
																		e
																	) =>
																		setEditingExpense(
																			{
																				...editingExpense,
																				description:
																					e
																						.target
																						.value,
																			}
																		)
																	}
																/>
															) : (
																expense?.description
															)}
														</TableCell>
														<TableCell>
															{editingExpense?.ID ===
															expense.ID ? (
																<div className="flex gap-2">
																	<Input
																		type="number"
																		value={
																			editingExpense.amount
																		}
																		onChange={(
																			e
																		) =>
																			setEditingExpense(
																				{
																					...editingExpense,
																					amount: Number(
																						e
																							.target
																							.value
																					),
																				}
																			)
																		}
																	/>
																	<Select
																		value={
																			editingExpense.currency
																		}
																		onValueChange={(
																			value
																		) =>
																			setEditingExpense(
																				{
																					...editingExpense,
																					currency:
																						value,
																				}
																			)
																		}
																	>
																		<SelectTrigger className="w-[80px]">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="JPY">
																				JPY
																			</SelectItem>
																			<SelectItem value="USD">
																				USD
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															) : (
																formatAmount(
																	expense?.amount,
																	expense?.currency
																)
															)}
														</TableCell>
														<TableCell>
															{editingExpense?.ID ===
															expense.ID ? (
																<Input
																	type="date"
																	value={
																		editingExpense.expense_date.split(
																			"T"
																		)[0]
																	}
																	onChange={(
																		e
																	) =>
																		setEditingExpense(
																			{
																				...editingExpense,
																				expense_date:
																					e
																						.target
																						.value,
																			}
																		)
																	}
																/>
															) : (
																new Date(
																	expense?.expense_date
																).toLocaleDateString()
															)}
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																{editingExpense?.ID ===
																expense.ID ? (
																	<>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() =>
																				handleEditExpense(
																					editingExpense
																				)
																			}
																		>
																			Save
																		</Button>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() =>
																				setEditingExpense(
																					null
																				)
																			}
																		>
																			Cancel
																		</Button>
																	</>
																) : (
																	<>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() =>
																				setEditingExpense(
																					expense
																				)
																			}
																		>
																			<Edit2 className="h-4 w-4" />
																		</Button>
																		<Button
																			variant="destructive"
																			size="sm"
																			onClick={() =>
																				handleDeleteExpense(
																					expense.ID
																				)
																			}
																		>
																			<Trash2 className="h-4 w-4" />
																		</Button>
																	</>
																)}
															</div>
														</TableCell>
													</TableRow>
												)
										  )}
								</TableBody>
							</Table>

							{expenseData?.data &&
								expenseData.data.length > 0 && (
									<div className="flex items-center justify-between py-4">
										<div className="flex items-center gap-2">
											<Select
												value={limit.toString()}
												onValueChange={(
													value
												) =>
													handleLimitChange(
														Number(
															value
														)
													)
												}
											>
												<SelectTrigger className="w-[80px]">
													<SelectValue
														placeholder={limit.toString()}
													/>
												</SelectTrigger>
												<SelectContent>
													{[
														5, 10, 20,
														50, 100,
													].map(
														(
															pageSize
														) => (
															<SelectItem
																key={
																	pageSize
																}
																value={pageSize.toString()}
															>
																{
																	pageSize
																}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<p className="text-sm text-muted-foreground">
												Showing{" "}
												{expenseData?.data
													?.length
													? startIndex
													: 0}{" "}
												to{" "}
												{expenseData?.data
													?.length
													? Math.min(
															endIndex,
															expenseData.total ||
																0
													  )
													: 0}{" "}
												of{" "}
												{expenseData?.total ||
													expenseData
														?.data
														?.length ||
													0}{" "}
												entries
											</p>
										</div>
										<div className="flex items-center space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handlePageChange(
														1
													)
												}
												disabled={
													page === 1
												}
											>
												First
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handlePageChange(
														page - 1
													)
												}
												disabled={
													page === 1
												}
											>
												Previous
											</Button>
											<span className="text-sm">
												Page {page} of{" "}
												{totalPages}
											</span>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handlePageChange(
														page + 1
													)
												}
												disabled={
													page >=
													totalPages
												}
											>
												Next
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handlePageChange(
														totalPages
													)
												}
												disabled={
													page >=
													totalPages
												}
											>
												Last
											</Button>
										</div>
									</div>
								)}
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
