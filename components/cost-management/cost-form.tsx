"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { Car } from "@/types/car";
import { Cost, CostCategory } from "@/types/cost-management";
import { addCarExpenses } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";

const formSchema = z.object({
	car_id: z.number().min(0, "Select a car"),
	amount: z.number().min(0, "Amount must be positive"),
	description: z.string().min(1, "Description is required"),
	currency: z.string(),
	expense_date: z.string(),
	created_by: z.string(),
	updated_by: z.string(),
});

const newCategorySchema = z.object({
	name: z.string().min(1, "Category name is required"),
});

interface CostFormProps {
	onSubmit: (cost: Cost) => void;
	cars: Car[];
	costCategories: CostCategory[];
	onAddCategory: (category: CostCategory) => void;
}

export function CostForm({
	onSubmit,
	cars,
	costCategories,
	onAddCategory,
}: CostFormProps) {
	const [isAddingCategory, setIsAddingCategory] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			car_id: 0,
			amount: 0,
			description: "",
			expense_date: new Date().toISOString().split("T")[0],
			currency: "USD",
			created_by: "admin",
			updated_by: "admin",
		},
	});

	const newCategoryForm = useForm<z.infer<typeof newCategorySchema>>({
		resolver: zodResolver(newCategorySchema),
		defaultValues: {
			name: "",
		},
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		const cost: Cost = {
			...values,
			expense_date: values.expense_date.toString(),
			// 	type: costCategories.find((cat) => cat.id === values.categoryId)
			// 		?.name as CostType,
		};

		try {
			const response = await addCarExpenses({
				url: `${BASE_URL}/car/expense`,
				expense: cost,
			});

			if (response.data) {
				toast.success(response.message);
			}
		} catch (error: any) {
			toast.error(error || "An error occurred");
		}
		onSubmit(cost);
		form.reset();
	}

	function handleAddCategory(values: z.infer<typeof newCategorySchema>) {
		const newCategory: CostCategory = {
			id: Math.random().toString(36).substr(2, 9),
			name: values.name,
		};
		onAddCategory(newCategory);
		newCategoryForm.reset();
		setIsAddingCategory(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="car_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Car</FormLabel>
							<Select
								onValueChange={(value) =>
									field.onChange(Number(value))
								}
								defaultValue={field.value.toString()}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a car" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{cars?.map((car) => (
										<SelectItem
											key={car.ID}
											value={
												car.ID?.toString() ??
												""
											}
										>
											{car.make} {car.model}{" "}
											{car.colour}{" "}
											{car.maunufacture_year} ({" "}
											{car.vin_number}{" "}
											{car.engine_number}{" "}
											{car.engine_capacity}{" "}
											{car.transmission}{" "}
											{car.body_type}{" "}
											{car.colour}{" "}
											{car.auction}{" "}
											{car.currency}{" "}
											{car.bid_price}{" "}
											{car.purchase_date}{" "}
											{car.destination}{" "}
											{car.broker_name}{" "}
											{car.broker_number}{" "}
											{car.vat_tax}{" "}
											{car.number_plate}{" "}
											{car.customer_id}{" "}
											{car.created_by}{" "}
											{car.updated_by})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name="categoryId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cost Category</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select cost category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{costCategories.map((category) => (
										<SelectItem
											key={category.id}
											value={category.id}
										>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
							<Dialog
								open={isAddingCategory}
								onOpenChange={setIsAddingCategory}
							>
								<DialogTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="mt-2"
									>
										<Plus className="mr-2 h-4 w-4" />{" "}
										Add New Category
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											Add New Cost Category
										</DialogTitle>
									</DialogHeader>
									<Form {...newCategoryForm}>
										<form
											onSubmit={newCategoryForm.handleSubmit(
												handleAddCategory
											)}
											className="space-y-4"
										>
											<FormField
												control={
													newCategoryForm.control
												}
												name="name"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Category
															Name
														</FormLabel>
														<FormControl>
															<Input
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<Button type="submit">
												Add Category
											</Button>
										</form>
									</Form>
								</DialogContent>
							</Dialog>
						</FormItem>
					)}
				/> */}

				<FormField
					control={form.control}
					name="currency"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Currency</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) =>
										field.onChange(
											parseFloat(
												e.target.value
											)
										)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea {...field} />
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
							<FormLabel>Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] pl-3 text-left font-normal",
												!field.value &&
													"text-muted-foreground"
											)}
										>
											{field.value ? (
												format(
													field.value,
													"PPP"
												)
											) : (
												<span>
													Pick a date
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
										onSelect={field.onChange}
										disabled={(date) =>
											date > new Date() ||
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
				<Button type="submit">Record Cost</Button>
			</form>
		</Form>
	);
}
