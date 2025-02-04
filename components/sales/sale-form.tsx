"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Switch } from "@/components/ui/switch";
import { Car } from "@/types/car";
import { Sale } from "@/types/sale";
import { Company, ICompany } from "@/types/company";
import { BASE_URL } from "@/constants/baseUrl";
import useSWR from "swr";
import { fetcher } from "@/apis";

const formSchema = z.object({
	totalPrice: z.number().positive("Total price must be positive"),
	saleDate: z.date(),
	car_id: z.number().positive("Please select a car"),
	company_id: z.number().positive("Please select a company"),
	isFullPayment: z.boolean(),
	paymentPeriod: z.number().min(0, "Payment period must be 0 or greater"),
	installments: z
		.array(
			z.object({
				amount: z.number().positive("Amount must be positive"),
				dueDate: z.date(),
			})
		)
		.max(4, "Maximum 4 installments allowed")
		.optional(),
});


interface SaleFormProps {
	onSubmit: (sale: {
		total_price: number;
		sale_date: string;
		car_id: number;
		company_id: number;
		is_full_payment: boolean;
		payment_period: number;
		created_by: string;
		updated_by: string;
		installments?: {
			id: number;
			amount: number;
			paid: boolean;
			due_date: string;
		}[];
	}) => void;

	companies: ICompany[];
}

function InstallmentFields({
	control,
	isFullPayment,
}: {
	control: any;
	isFullPayment: boolean;
}) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "installments",
	});

	if (isFullPayment) return null;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Installments</h3>
			{fields.map((field, index) => (
				<div
					key={field.id}
					className="flex items-end space-x-4"
				>
					<FormField
						control={control}
						name={`installments.${index}.amount`}
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
						control={control}
						name={`installments.${index}.dueDate`}
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Due Date</FormLabel>
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
														Pick a
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
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date < new Date()
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => remove(index)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			))}
			{fields.length < 4 && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() =>
						append({ amount: 0, dueDate: new Date() })
					}
				>
					Add Installment
				</Button>
			)}
		</div>
	);
}



export function SaleForm({ onSubmit,  companies }: SaleFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			totalPrice: 0,
			saleDate: new Date(),
			car_id: 0,
			company_id: 0,
			isFullPayment: true,
			paymentPeriod: 0,
			installments: [],
		},
	});

	function handleSubmit(values: z.infer<typeof formSchema>) {
	

		onSubmit({
			total_price: values.totalPrice,
			sale_date: format(values.saleDate, "yyyy-MM-dd"),
			car_id: values.car_id,
			company_id: values.company_id,
			is_full_payment: values?.isFullPayment,
			payment_period: values.paymentPeriod ?? 0,
			created_by: "admin",
			updated_by: "admin",
		});

		form.reset(); 
	}

	const [finalCars, setFinalCars] = React.useState<Car[]>([]);

	const {
		data: carList,
		error: carListError,
		isLoading: carListLoading,
	} = useSWR(`${BASE_URL}/cars`, fetcher);

	React.useEffect(() => {
		if (carList?.data) {
			const flattenedList = carList.data.map((item: any) => item.car);
			setFinalCars(flattenedList);
		}
	}, [carList]);


	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="totalPrice"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total Price</FormLabel>
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
					name="saleDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Sale Date</FormLabel>
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
										selected={field.value}
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
				<FormField
					control={form.control}
					name="car_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Car</FormLabel>
							<Select
								onValueChange={(value) =>
									field.onChange(parseInt(value, 10))
								}
								value={field.value?.toString() || ""}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a car" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{finalCars?.map((car) => (
										<SelectItem
											key={car.car_uuid}
											value={
												car.ID?.toString() ||
												""
											}
										>
											{car.make} {car.model} (
											{car.manufacture_year})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="company_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company</FormLabel>
							<FormControl>
								<Select
									onValueChange={(value) => {
										const numberValue =
											Number(value);
										field.onChange(numberValue);
									}}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select  company" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{companies?.map(
											(company: ICompany) => (
												<SelectItem
													key={
														company.ID
													}
													value={company.ID.toString()}
												>
													{company.name}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="isFullPayment"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">
									Full Payment
								</FormLabel>
								<FormDescription>
									Is this a full payment or a partial
									payment?
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="paymentPeriod"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Payment Period (months)
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) =>
										field.onChange(
											parseInt(e.target.value)
										)
									}
								/>
							</FormControl>
							<FormDescription>
								If this is not a full payment, enter the
								payment period in months.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<InstallmentFields
					control={form.control}
					isFullPayment={form.watch("isFullPayment")}
				/>
				<Button type="submit">Add Sale</Button>
			</form>
		</Form>
	);
}
