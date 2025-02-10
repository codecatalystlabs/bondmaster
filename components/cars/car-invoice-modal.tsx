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
	car_shipping_invoice_id: z.number(),
	updated_by: z.string(),
});

interface CarInvoiceProps {
	carId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function CarInvoiceModal({
	carId,
	open,
	onOpenChange,
	onSubmit,
}: CarInvoiceProps) {
	const { data: invoicesData, isLoading } = useSWR(
		`${BASE_URL}/shipping/invoices`,
		fetcher
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			car_shipping_invoice_id: 0,
			updated_by: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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
					<DialogTitle>Add Car Invoice</DialogTitle>
					<DialogDescription>
						Enter the details for the new car invoice.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="car_shipping_invoice_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Invoice </FormLabel>
									<Select
										onValueChange={(value) => {
											const numberValue =
												Number(value);
											field.onChange(
												numberValue
											);
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select invoice" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{invoicesData?.data.map(
												(invoice: any) => (
													<SelectItem
														key={
															invoice
																?.customer
																.ID
														}
														value={
															invoice
																?.customer
																.ID
														}
													>
														{
															invoice
																?.customer
																.invoice_no
														}{" "}
														-{" "}
														{
															invoice
																?.customer
																.vessel_name
														}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit">Add Invoice</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
