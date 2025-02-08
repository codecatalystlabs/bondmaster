"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import useUserStore from "@/app/store/userStore";
import { Invoice } from "@/types/expense";
import { createInvoice } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import { mutate } from "swr";

const formSchema = z.object({
	invoice_no: z.string().min(1, { message: "Invoice number is required" }),
	ship_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: "Invalid date format. Use YYYY-MM-DD",
		}),
	currency: z.string().min(1, { message: "Currency is required" }),
	total_cost: z
		.number()
		.positive({ message: "Total cost must be positive" }),
	vessel_name: z.string().min(1, { message: "Vessel name is required" }),
	from_location: z.string().min(1, { message: "From location is required" }),
	to_location: z.string().min(1, { message: "To location is required" }),
	created_by: z.string().min(1, { message: "Created by is required" }),
	updated_by: z.string().min(1, { message: "Updated by is required" }),
});

export function InvoiceForm() {
	const [lastInvoiceNumber, setLastInvoiceNumber] = useState(0);
	const user = useUserStore((state) => state.user)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			invoice_no: "",
			ship_date: "",
			currency: "Yen",
			total_cost: 0,
			vessel_name: "",
			from_location: "",
			to_location: "",
			created_by: user?.username,
			updated_by: user?.username,
		},
	});

	useEffect(() => {
		// In a real application, you would fetch the last invoice number from your backend
		// For this example, we'll simulate it with a random number
		const fetchLastInvoiceNumber = async () => {
			// Simulating an API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const randomNumber = Math.floor(Math.random() * 1000000);
			setLastInvoiceNumber(randomNumber);
		};

		fetchLastInvoiceNumber();
	}, []);

	useEffect(() => {
		if (lastInvoiceNumber > 0) {
			const newInvoiceNumber = `JP${String(
				lastInvoiceNumber + 1
			).padStart(9, "0")}`;
			form.setValue("invoice_no", newInvoiceNumber);
		}
	}, [lastInvoiceNumber, form]);

async function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: Invoice = {
			...values
		}

		try {
			await createInvoice({
				url: `${BASE_URL}/shipping/invoices`,
				invoiceData:payload
			});

			mutate(`${BASE_URL}/shipping/invoices`);
			toast.success("Invoice added successfuly")
			
		} catch (error) {
			console.log(error)
			toast.error(error)
		}
		
	
		setLastInvoiceNumber((prev) => prev + 1);
		form.reset({
			...form.getValues(),
			ship_date: "",
			currency: "Yen",
			total_cost: 0,
			vessel_name: "",
			from_location: "",
			to_location: "",
			created_by: "",
			updated_by: "",
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="invoice_no"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Invoice Number</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="ship_date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ship Date</FormLabel>
							<FormControl>
								<Input
									type="date"
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
					name="total_cost"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total Cost</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) =>
										field.onChange(
											Number.parseFloat(
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
					name="vessel_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Vessel Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="from_location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>From Location</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="to_location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>To Location</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="created_by"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Created By</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="updated_by"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Updated By</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
