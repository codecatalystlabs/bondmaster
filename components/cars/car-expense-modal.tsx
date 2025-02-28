import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
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
import useSWR, { mutate } from "swr";
import { addCarExpenses, fetcher } from "@/apis";
import { ICurrency } from "@/types/cost-management";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";
import useUserStore from "@/app/store/userStore";

const formSchema = z.object({
	description_type: z.string(),
	custom_description: z.string().optional(),
	currency: z.string().min(1, "Currency is required"),
	amount: z.number().min(1, "Amount must be positive"),
	expense_date: z.string().min(1, "Date is required"),
	carrier_name: z.string().optional(),
	expense_remark: z.string().optional(),
});

interface CarExpenseModalProps {
	carId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: any) => void;
}

export function CarExpenseModal({
	carId,
	open,
	onOpenChange,
	onSubmit,
}: CarExpenseModalProps) {
	const {
		data: expenses,
		error: expenseError,
		isLoading: idLoadingExpense,
	} = useSWR(`/meta/expenses`, fetcher);

	// Filter car expenses
	const carExpenses =
		expenses?.data?.filter(
			(expense: any) => expense.category === "car"
		) || [];

	const user = useUserStore((state) => state.user);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description_type: "",
			custom_description: "",
			currency: "JPY",
			amount: 0,
			expense_date: new Date().toISOString().split("T")[0],
			carrier_name: "",
			expense_remark: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const description =
			values.description_type === "CUSTOM"
				? values.custom_description
				: values.description_type;

		try {
			await onSubmit({
				car_id: Number(carId),
				description,
				currency: values.currency,
				amount: values.amount,
				expense_date: values.expense_date,
				carrier_name:
					values.description_type === "Carrier car fee(RISKO)"
						? values.carrier_name
						: "",
				expense_remark: values.expense_remark,
			});

			await Promise.all([
				mutate(`/car/${carId}/expenses`),
				mutate(`/car/vin/${carId}`),
				mutate(`/expenses`),
				mutate(`/car/${carId}/expenses?page=1&limit=10`),
			]);

			form.reset();
			onOpenChange(false);
			toast.success("Expense added successfully");
		} catch (error) {
			toast.error("Failed to add expense");
			console.error("Error adding expense:", error);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Expense</DialogTitle>
					<DialogDescription>
						Enter the details for the new car expense.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="description_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Description Type
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select description" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{carExpenses?.map(
												(expense: any) => (
													<SelectItem
														key={
															expense.ID
														}
														value={
															expense.name
														}
													>
														{
															expense.name
														}
													</SelectItem>
												)
											)}
											<SelectItem value="CUSTOM">
												Custom Description
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{form.watch("description_type") === "CUSTOM" && (
							<FormField
								control={form.control}
								name="custom_description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Custom Description
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter custom description"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{form.watch("description_type") ===
							"Carrier car fee(RISKO)" && (
							<FormField
								control={form.control}
								name="carrier_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Carrier Name
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter carrier name"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="expense_remark"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Expense Remark
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter expense remark"
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
											<SelectItem value="UGX">
												UGX
											</SelectItem>
											<SelectItem value="USD">
												USD
											</SelectItem>
											<SelectItem value="JPY">
												JPY
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
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) =>
												field.onChange(
													Number(
														e.target
															.value
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
							name="expense_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
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

						<Button type="submit">Add Expense</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
