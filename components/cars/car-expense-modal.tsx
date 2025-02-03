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
import useSWR from "swr";
import { fetcher } from "@/apis";

const formSchema = z.object({
	description: z.string().min(1, "Description is required"),
	currency: z.string().min(1, "Currency is required"),
	amount: z.number().positive("Amount must be positive"),
	expense_date: z.string().min(1, "Expense date is required"),
});

interface CarExpenseModalProps {
	carId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function CarExpenseModal({
	carId,
	open,
	onOpenChange,
	onSubmit,
}: CarExpenseModalProps) {
   const {
		data: currencies,
		error: currencyError,
		isLoading: idLoadingCurrency,
   } = useSWR(`/meta/currency`, fetcher);
    

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: "",
			currency: "UGX",
			amount: 0,
			expense_date: new Date().toISOString().split("T")[0],
		},
	});

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		onSubmit({ ...values });
		form.reset();
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Car Expense</DialogTitle>
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
                                                                                                currency.name
                                                                                            }
                                                                                        >
                                                                                            {currency.name}
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
											onChange={(e) =>
												field.onChange(
													Number.parseFloat(
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
									<FormLabel>Expense Date</FormLabel>
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
