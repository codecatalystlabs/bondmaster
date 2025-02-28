"use client";

import { useRef, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/apis";
import { formatAmount } from "@/lib/utils";
import useSWR from "swr";
import { Loader } from "@/components/ui/loader";

interface CarExpense {
	ID: number;
	description: string;
	amount: number;
	currency: string;
	expense_date: string;
}

interface CarWithExpenses {
	car: any;
	expenses: CarExpense[];
}

interface InvoicePreviewDialogProps {
	invoice: {
		cars: Array<{
			ID: number;
			car_uuid: string;
			chasis_number: string;
			engine_number: string;
			engine_capacity: string;
			make: string;
			car_model: string;
			manufacture_year: number;
			colour: string;
			bid_price: number;
			vat_tax: number;
			currency: string;
			purchase_date?: string;
			// Other car properties...
		}>;
		invoice: {
			ID: number;
			invoice_no: string;
			ship_date: string;
			vessel_name: string;
			from_location: string;
			to_location: string;
			created_by: string;
			updated_by: string;
			CreatedAt?: string;
		};
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function InvoicePreviewDialog({
	invoice,
	open,
	onOpenChange,
}: InvoicePreviewDialogProps) {
	const previewRef = useRef<HTMLDivElement>(null);
	const [carsWithExpenses, setCarsWithExpenses] = useState<
		CarWithExpenses[]
	>([]);
	const [uniqueExpenseTypes, setUniqueExpenseTypes] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch expenses for all cars in the invoice
	useEffect(() => {
		if (open && invoice?.cars?.length > 0) {
			setIsLoading(true);
			const fetchAllCarExpenses = async () => {
				try {
					const carsWithExpensesData: CarWithExpenses[] = [];
					const allExpenseTypes = new Set<string>();

					// Fetch expenses for each car
					for (const car of invoice.cars) {
						const expenseData = await fetcher(
							`/car/${car.ID}/expenses`
						);

						// Add each expense type to our set of unique types
						if (expenseData?.data) {
							expenseData.data.forEach(
								(expense: CarExpense) => {
									allExpenseTypes.add(
										expense.description
									);
								}
							);
						}

						carsWithExpensesData.push({
							car,
							expenses: expenseData?.data || [],
						});
					}

					setCarsWithExpenses(carsWithExpensesData);
					setUniqueExpenseTypes(Array.from(allExpenseTypes));
					setIsLoading(false);
				} catch (error) {
					console.error("Error fetching car expenses:", error);
					setIsLoading(false);
				}
			};

			fetchAllCarExpenses();
		}
	}, [open, invoice]);

	const handlePrint = () => {
		if (previewRef.current) {
			const printContent = previewRef.current;
			const printWindow = window.open("", "_blank");

			if (printWindow) {
				printWindow.document.write(`
					<html>
						<head>
							<title>Invoice ${invoice?.invoice?.invoice_no || ""}</title>
							<style>
								body { font-family: Arial, sans-serif; }
								table { width: 100%; border-collapse: collapse; }
								th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
								th { background-color: #f2f2f2; }
								.text-right { text-align: right; }
							</style>
						</head>
						<body>
							${printContent.innerHTML}
						</body>
					</html>
				`);

				printWindow.document.close();
				printWindow.focus();
				printWindow.print();
				printWindow.close();
			}
		}
	};

	// Calculate expense totals by type
	const calculateExpenseTotalsByType = () => {
		const totals: Record<string, number> = {};

		uniqueExpenseTypes.forEach((type) => {
			totals[type] = 0;

			carsWithExpenses.forEach((carWithExpense) => {
				const matchingExpense = carWithExpense.expenses.find(
					(expense) => expense.description === type
				);

				if (matchingExpense) {
					totals[type] += matchingExpense.amount;
				}
			});
		});

		return totals;
	};

	// Calculate row totals (all expenses + bid price + vat for a car)
	const calculateRowTotals = () => {
		return carsWithExpenses.map((carWithExpense) => {
			let total = carWithExpense.car.bid_price || 0;
			total += carWithExpense.car.vat_tax || 0;

			carWithExpense.expenses.forEach((expense) => {
				total += expense.amount;
			});

			return total;
		});
	};

	// Calculate grand total
	const calculateGrandTotal = () => {
		let total = 0;

		carsWithExpenses.forEach((carWithExpense) => {
			total += carWithExpense.car.bid_price || 0;
			total += carWithExpense.car.vat_tax || 0;

			carWithExpense.expenses.forEach((expense) => {
				total += expense.amount;
			});
		});

		return total;
	};

	const expenseTotals = calculateExpenseTotalsByType();
	const rowTotals = calculateRowTotals();
	const grandTotal = calculateGrandTotal();
	const currency = invoice?.cars?.[0]?.currency || "";

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Invoice Preview</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Loader />
						<span className="ml-2">
							Loading expense data...
						</span>
					</div>
				) : (
					<div
						className="p-6"
						ref={previewRef}
					>
						<div className="mb-8 text-center">
							<h1 className="text-2xl font-bold">
								MADINA TRADING CO Ltd.
							</h1>
							<p className="text-lg">
								Invoice #:{" "}
								{invoice?.invoice?.invoice_no}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-8 mb-8">
							<div>
								<h2 className="text-lg font-semibold mb-2">
									Shipping Details
								</h2>
								<p>
									<strong>Ship Date:</strong>{" "}
									{new Date(
										invoice?.invoice?.ship_date
									).toLocaleDateString()}
								</p>
								<p>
									<strong>Vessel Name:</strong>{" "}
									{invoice?.invoice?.vessel_name}
								</p>
								<p>
									<strong>From:</strong>{" "}
									{invoice?.invoice?.from_location}
								</p>
								<p>
									<strong>To:</strong>{" "}
									{invoice?.invoice?.to_location}
								</p>
							</div>
							<div>
								<h2 className="text-lg font-semibold mb-2">
									Invoice Information
								</h2>
								<p>
									<strong>Created By:</strong>{" "}
									{invoice?.invoice?.created_by}
								</p>
								<p>
									<strong>Date:</strong>{" "}
									{invoice?.invoice?.CreatedAt
										? new Date(
												invoice.invoice.CreatedAt
										  ).toLocaleDateString()
										: "N/A"}
								</p>
								<p>
									<strong>To:</strong> SHERAZ TRADING
									U LTD
								</p>
							</div>
						</div>

						<div className="mb-8 overflow-x-auto">
							<h2 className="text-lg font-semibold mb-4">
								Cars and Expenses
							</h2>
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-gray-100">
										<th className="border p-2 text-left">
											SR NO
										</th>
										<th className="border p-2 text-left">
											DATE
										</th>
										<th className="border p-2 text-left">
											MODEL
										</th>
										<th className="border p-2 text-left">
											CHASSIS
										</th>
										<th className="border p-2 text-right">
											BUY
										</th>
										<th className="border p-2 text-right">
											TAX
										</th>
										{/* Dynamic expense type columns */}
										{uniqueExpenseTypes.map(
											(type) => (
												<th
													key={type}
													className="border p-2 text-right"
												>
													{type}
												</th>
											)
										)}
										<th className="border p-2 text-right">
											TOTAL
										</th>
									</tr>
								</thead>
								<tbody>
									{carsWithExpenses.map(
										(carWithExpense, index) => (
											<tr
												key={
													carWithExpense
														.car.ID
												}
												className={
													index % 2 === 0
														? "bg-gray-50"
														: ""
												}
											>
												<td className="border p-2">
													{index + 1}
												</td>
												<td className="border p-2">
													{carWithExpense
														.car
														.purchase_date
														? new Date(
																carWithExpense.car.purchase_date
														  ).toLocaleDateString()
														: "N/A"}
												</td>
												<td className="border p-2">
													{carWithExpense
														.car
														.car_model ||
														"N/A"}
												</td>
												<td className="border p-2">
													{carWithExpense
														.car
														.chasis_number ||
														"N/A"}
												</td>
												<td className="border p-2 text-right">
													{formatAmount(
														carWithExpense
															.car
															.bid_price,
														currency
													)}
												</td>
												<td className="border p-2 text-right">
													{formatAmount(
														carWithExpense
															.car
															.vat_tax,
														currency
													)}
												</td>

												{/* Dynamic expense values */}
												{uniqueExpenseTypes.map(
													(type) => {
														const expense =
															carWithExpense.expenses.find(
																(
																	e
																) =>
																	e.description ===
																	type
															);
														return (
															<td
																key={`${carWithExpense.car.ID}-${type}`}
																className="border p-2 text-right"
															>
																{expense
																	? formatAmount(
																			expense.amount,
																			currency
																	  )
																	: "-"}
															</td>
														);
													}
												)}

												{/* Row total */}
												<td className="border p-2 text-right font-semibold">
													{formatAmount(
														rowTotals[
															index
														],
														currency
													)}
												</td>
											</tr>
										)
									)}
								</tbody>
								<tfoot>
									<tr className="font-bold bg-gray-100">
										<td
											className="border p-2"
											colSpan={4}
										>
											Total
										</td>
										<td className="border p-2 text-right">
											{formatAmount(
												carsWithExpenses.reduce(
													(sum, car) =>
														sum +
														(car.car
															.bid_price ||
															0),
													0
												),
												currency
											)}
										</td>
										<td className="border p-2 text-right">
											{formatAmount(
												carsWithExpenses.reduce(
													(sum, car) =>
														sum +
														(car.car
															.vat_tax ||
															0),
													0
												),
												currency
											)}
										</td>

										{/* Expense type totals */}
										{uniqueExpenseTypes.map(
											(type) => (
												<td
													key={`total-${type}`}
													className="border p-2 text-right"
												>
													{formatAmount(
														expenseTotals[
															type
														],
														currency
													)}
												</td>
											)
										)}

										{/* Grand total */}
										<td className="border p-2 text-right">
											{formatAmount(
												grandTotal,
												currency
											)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

						<div className="grid grid-cols-2 gap-8 mt-12">
							<div>
								<p className="border-t pt-2">
									<strong>Notes:</strong>
								</p>
								<p>
									All prices are in {currency}.
									Payment is due within 30 days.
								</p>
							</div>
							<div className="text-right">
								<p className="border-t pt-2 mt-8">
									<strong>
										Authorized Signature
									</strong>
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="sticky bottom-0 bg-background p-4 border-t">
					<Button
						onClick={handlePrint}
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Print Invoice"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
