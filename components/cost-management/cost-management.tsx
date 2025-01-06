"use client";

import * as React from "react";
import { CostForm } from "./cost-form";
import { InvoiceGenerator } from "./invoice-generator";
import { Cost, Invoice, CostCategory } from "@/types/cost-management";
import { Car, CarExpense } from "@/types/car";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from "swr";
import { BASE_URL } from "@/constants/baseUrl";
import { fetcher } from "@/apis";

// Mock data
const buyers = [
	{ id: "1", name: "John Doe" },
	{ id: "2", name: "Jane Smith" },
];

const initialCostCategories: CostCategory[] = [
	{ id: "1", name: "inspection" },
	{ id: "2", name: "cleaning" },
	{ id: "3", name: "inland_transport" },
	{ id: "4", name: "customs" },
	{ id: "5", name: "storage" },
	{ id: "6", name: "repairs" },
	{ id: "7", name: "documentation" },
	{ id: "8", name: "other" },
];

export function CostManagement() {
	const [costs, setCosts] = React.useState<Cost[]>([]);
	const [invoices, setInvoices] = React.useState<Invoice[]>([]);
	const [costCategories, setCostCategories] = React.useState<CostCategory[]>(
		initialCostCategories
	);
	const [cars, setCars] = React.useState<Car[]>([]);

	const {
		data: carExpensesList,
		isLoading: carExpensesLoading,
		error: carExpensesError,
	} = useSWR(`${BASE_URL}/carExpenses`, fetcher);

	const {
		data: carList,
		error: carListError,
		isLoading: carListLoading,
	} = useSWR(`${BASE_URL}/cars`, fetcher);

	React.useEffect(() => {
		if (carList?.data) {
			const flattenedList = carList.data.map((item: any) => item.car);
			setCars(flattenedList);
		}
	}, [carList]);

	const handleCostSubmit = (cost: Cost) => {
		setCosts([...costs, cost]);
	};

	const handleInvoiceSubmit = (invoice: Invoice) => {
		setInvoices([...invoices, invoice]);
	};

	const handleAddCategory = (category: CostCategory) => {
		setCostCategories([...costCategories, category]);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Cost Management</CardTitle>
				<CardDescription>
					Record costs and generate invoices for car buyers or
					Ugandan agents.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs
					defaultValue="costs"
					className="space-y-4"
				>
					<TabsList>
						<TabsTrigger value="costs">
							Record Costs
						</TabsTrigger>
						<TabsTrigger value="invoices">
							Generate Invoices
						</TabsTrigger>
					</TabsList>
					<TabsContent value="costs">
						<div className="space-y-4">
							<CostForm
								onSubmit={handleCostSubmit}
								cars={cars}
								costCategories={costCategories}
								onAddCategory={handleAddCategory}
							/>
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Recorded Costs
								</h3>
								{carExpensesLoading ? (
									<p>Loading car expenses...</p>
								) : carExpensesError ? (
									<p>Error loading car expenses.</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>
													Car
												</TableHead>
												<TableHead>
													Category
												</TableHead>
												<TableHead>
													Amount
												</TableHead>
												<TableHead>
													Description
												</TableHead>
												<TableHead>
													Date
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{carExpensesList?.data.map(
												(
													expense: CarExpense
												) => (
													<TableRow
														key={
															expense.ID
														}
													>
														<TableCell>
															{
																cars.find(
																	(
																		car
																	) =>
																		Number(
																			car.ID
																		) ===
																		expense.ID
																)
																	?.model
															}
														</TableCell>

														<TableCell>
															{
																expense.description
															}
														</TableCell>
														<TableCell>
															{new Date(
																expense.expense_date
															).toLocaleDateString()}
														</TableCell>
														<TableCell>
															{
																expense.amount
															}
														</TableCell>
														<TableCell>
															{
																expense.currency
															}
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								)}
							</div>
						</div>
					</TabsContent>
					<TabsContent value="invoices">
						<div className="space-y-4">
							<InvoiceGenerator
								onSubmit={handleInvoiceSubmit}
								cars={cars}
								costs={costs}
								buyers={buyers}
							/>
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Generated Invoices
								</h3>
								{carListLoading ? (
									<p>Loading cars...</p>
								) : carListError ? (
									<p>Error loading car list.</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>
													Invoice Number
												</TableHead>
												<TableHead>
													Buyer
												</TableHead>
												<TableHead>
													Total Amount
												</TableHead>
												<TableHead>
													Status
												</TableHead>
												<TableHead>
													Due Date
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{invoices.map(
												(invoice) => (
													<TableRow
														key={
															invoice.id
														}
													>
														<TableCell>
															{
																invoice.invoiceNumber
															}
														</TableCell>
														<TableCell>
															{
																invoice.buyerName
															}
														</TableCell>
														<TableCell>
															$
															{
																invoice.totalAmount
															}
														</TableCell>
														<TableCell>
															{
																invoice.status
															}
														</TableCell>
														<TableCell>
															{new Date(
																invoice.dueDate
															).toLocaleDateString()}
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								)}
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
