import { fetcher } from "@/apis";
import useSWR from "swr";
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
import { ICurrency } from "@/types/cost-management";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "../ui/button";


const formSchema = z.object({
	company_id: z.number(),
	description: z.string().min(1, "Description is required"),
	currency: z.string().min(1, "Currency is required"),
	amount: z.union([
		z.number().min(1, "Amount is required"),
		z.number().positive("Amount must be positive"),
	]),
	// dollar_rate: z.union([
	// 	z.number().min(1, "Amount is required"),
	// 	z.number().positive("Amount must be positive"),
	// ]),
	expense_date: z.string(),
});


export function ExpenseForm({
	form,
	onSubmit,
}: {
	form: any;
	onSubmit: (values: any) => void;
    }) {
  


	const {
		data: currencies,
		error: currencyError,
		isLoading: idLoadingCurrency,
	} = useSWR(`/meta/currency`, fetcher);

	return (
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
							<FormLabel>Description</FormLabel>
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
							<FormLabel>Currency</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{currencies?.data.map(
										(currency: ICurrency) => (
											<SelectItem
												key={currency.ID}
												value={
													currency.symbol
												}
											>
												{currency.symbol}
											</SelectItem>
										)
									)}
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
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter amount"
									{...field}
									value={field.value || ""}
									onChange={(e) => {
										const value =
											e.target.value === ""
												? ""
												: parseFloat(
														e.target
															.value
												  );
										field.onChange(value);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name="dollar_rate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dollar Rate</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter dollar rate"
									{...field}
									value={field.value || ""}
									onChange={(e) => {
										const value =
											e.target.value === ""
												? ""
												: parseFloat(
														e.target
															.value
												  );
										field.onChange(value);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}
				<FormField
					control={form.control}
					name="expense_date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Expense Date</FormLabel>
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
													new Date(
														field.value
													).toISOString(),
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
										onSelect={(date) =>
											field.onChange(
												date?.toISOString()
											)
										}
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
				<Button type="submit">Save Expense</Button>
			</form>
		</Form>
	);
}
