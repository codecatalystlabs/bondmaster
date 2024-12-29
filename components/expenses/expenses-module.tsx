"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, CustomTooltipProps } from "@/components/ui/chart";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { BASE_URL } from "@/constants/baseUrl";
import { addCompanyExpenses, fetcher } from "@/apis";
import { Expense, ExpenseResponse } from "@/types/expense";
import { Loader } from "../ui/loader";

interface ITotalExpense {
	sum: number;
	expense: Expense;
}

const formSchema = z.object({
	company_id: z.number(),
	description: z.string().min(1, "Description is required"),
	currency: z.string().min(1, "Currency is required"),
	amount: z.union([
		z.number().min(1, "Amount is required"),
		z.number().positive("Amount must be positive"),
	]),
	expense_date: z.string(),
});

export function ExpensesModule() {
	const [expenses, setExpenses] = React.useState<Expense[]>([]);

	const { data: expensesData, isLoading } = useSWR(
		`${BASE_URL}/expenses`,
		fetcher
	);

	console.log(expensesData);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			company_id: 0,
			description: "",
			currency: "USD",
			amount: 0,
			expense_date: new Date().toISOString(),
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const newExpense: Expense = {
			...values,
			company_id: 1,
			created_by: "admin",
			updated_by: "admin",
		};

		try {
			const response = await addCompanyExpenses({
				url: `${BASE_URL}/company/expense`,
				expense: newExpense,
			});

			mutate(`${BASE_URL}/company/expenses`);
			toast.success("Expense added successfully");
			form.reset();
		} catch (error) {
			console.log(error);
		}
	}

	const totalExpenses = expensesData?.reduce(
		(sum: any, expense: Expense) => sum + expense.amount,
		0
	);
	const averageExpense =
		expensesData?.length > 0 ? totalExpenses / expensesData?.length : 0;

	const expensesByMonth = expensesData?.reduce(
		(acc: any, expense: Expense) => {
			const month = format(new Date(expense.expense_date), "MMM yyyy");
			if (!acc[month]) {
				acc[month] = 0;
			}
			acc[month] += expense.amount;
			return acc;
		},
		{} as Record<string, number>
	);

	const chartData = expensesByMonth
		? Object.entries(expensesByMonth)
				.sort(
					([a], [b]) =>
						new Date(a).getTime() - new Date(b).getTime()
				)
				.map(([month, total]) => ({
					month,
					total,
				}))
		: [];

	return (
		<Tabs
			defaultValue="overview"
			className="space-y-4"
		>
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="add">Add Expense</TabsTrigger>
				<TabsTrigger value="list">Expense List</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">
				<Card>
					<CardHeader>
						<CardTitle>Expense Overview</CardTitle>
						<CardDescription>
							View your expense summary and trends over
							time.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Expenses
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										${totalExpenses?.toFixed(2)}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Average Expense
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										${averageExpense.toFixed(2)}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Number of Expenses
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{expenses.length}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Latest Expense Date
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{expensesData?.length > 0
											? format(
													new Date(
														Math.max(
															...expensesData.map(
																(
																	e: ExpenseResponse
																) =>
																	new Date(
																		e.expense_date
																	).getTime()
															)
														)
													),
													"MMM d, yyyy"
											  )
											: "N/A"}
									</div>
								</CardContent>
							</Card>
						</div>
						<Card>
							<CardHeader>
								<CardTitle>
									Expenses Over Time
								</CardTitle>
							</CardHeader>
							<CardContent className="pl-2">
								{chartData.length > 0 ? (
									<LineChart
										data={chartData}
										categories={["total"]}
										index="month"
										colors={["blue"]}
										className="h-[200px] mt-6"
										yAxisWidth={60}
										customTooltip={({
											label,
											value,
										}) => (
											<div className="bg-white p-2 rounded shadow">
												<p className="font-bold">
													{label}
												</p>
												<p>
													$
													{value.toFixed(
														2
													)}
												</p>
											</div>
										)}
									/>
								) : (
									<div>No data to display</div>
								)}
							</CardContent>
						</Card>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="add">
				<Card>
					<CardHeader>
						<CardTitle>Add New Expense</CardTitle>
						<CardDescription>
							Enter the details of your new expense.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Description
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter expense description"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="currency"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Currency
											</FormLabel>
											<Select
												onValueChange={
													field.onChange
												}
												defaultValue={
													field.value
												}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select currency" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="USD">
														USD
													</SelectItem>
													<SelectItem value="EUR">
														EUR
													</SelectItem>
													<SelectItem value="GBP">
														GBP
													</SelectItem>
													<SelectItem value="JPY">
														JPY
													</SelectItem>
													<SelectItem value="UGX">
														UGX
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="amount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Amount
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Enter amount"
													{...field}
													value={
														field.value ||
														""
													}
													onChange={(
														e
													) => {
														const value =
															e
																.target
																.value ===
															""
																? ""
																: parseFloat(
																		e
																			.target
																			.value
																  );
														field.onChange(
															value
														);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="expense_date"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>
												Expense Date
											</FormLabel>
											<Popover>
												<PopoverTrigger
													asChild
												>
													<FormControl>
														<Button
															variant={
																"outline"
															}
															className={cn(
																"w-[240px] pl-3 text-left font-normal",
																!field.value &&
																	"text-muted-foreground"
															)}
														>
															{field.value ? (
																format(
																	new Date(
																		field.value
																	),
																	"PPP"
																)
															) : (
																<span>
																	Pick
																	a
																	date
																</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0"
													align="start"
												>
													<Calendar
														mode="single"
														selected={
															field.value
																? new Date(
																		field.value
																  )
																: undefined
														}
														onSelect={(
															date
														) =>
															field.onChange(
																date?.toISOString()
															)
														} // Convert date to ISO string
														disabled={(
															date
														) =>
															date >
																new Date() ||
															date <
																new Date(
																	"1900-01-01"
																)
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">
									Add Expense
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="list">
				{isLoading ? (
					<Loader />
				) : (
					<Card>
						<CardHeader>
							<CardTitle>Expense List</CardTitle>
							<CardDescription>
								View and manage your recorded expenses.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											Company ID
										</TableHead>
										<TableHead>
											Description
										</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>
											Currency
										</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{expensesData?.map(
										(
											expense: ExpenseResponse
										) => (
											<TableRow
												key={expense.ID}
											>
												<TableCell>
													{
														expense.company_id
													}
												</TableCell>
												<TableCell>
													{
														expense.description
													}
												</TableCell>
												<TableCell>
													{expense.amount.toFixed(
														2
													)}
												</TableCell>
												<TableCell>
													{
														expense.currency
													}
												</TableCell>
												<TableCell>
													{format(
														new Date(
															expense.expense_date
														),
														"MMM d, yyyy"
													)}
												</TableCell>
											</TableRow>
										)
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
			</TabsContent>
		</Tabs>
	);
}
