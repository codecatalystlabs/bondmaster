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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
	broker_name: z.string().min(1, "Broker name is required"),
	broker_number: z.string().min(1, "Broker number is required"),
	number_plate: z.string().min(1, "Number plate is required"),
	customer_id: z.number().positive("Customer ID must be positive"),
	car_status: z.string().min(1, "Car status is required"),
	car_payment_status: z.string().min(1, "Car payment status is required"),
	updated_by: z.string().min(1, "Updated by is required"),
});

interface CarBrokerModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: z.infer<typeof formSchema>) => void;
    carId:string;
	customers: any[]
}

export function AddCarDetails({ open, onOpenChange, onSubmit,carId,customers }: CarBrokerModalProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			broker_name: "",
			broker_number: "",
			number_plate: "",
			customer_id: 0,
			car_status: "In stock",
			car_payment_status: "Booked",
			updated_by: "admin",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		onSubmit(values);
		form.reset();
		onOpenChange(false);
	};

	console.log(customers,"AM CUSYOMEYE")

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Car Broker Details</DialogTitle>
					<DialogDescription>Enter the broker and car details.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<FormField control={form.control} name="broker_name" render={({ field }) => (
							<FormItem>
								<FormLabel>Broker Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter broker name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />

						<FormField control={form.control} name="broker_number" render={({ field }) => (
							<FormItem>
								<FormLabel>Broker Number</FormLabel>
								<FormControl>
									<Input placeholder="Enter broker number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />

						<FormField control={form.control} name="number_plate" render={({ field }) => (
							<FormItem>
								<FormLabel>Number Plate</FormLabel>
								<FormControl>
									<Input placeholder="Enter number plate" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />

<FormField control={form.control} name="customer_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers?.map((info:any) => (
                      <SelectItem key={info?.customer?.ID} value={String(info?.customer?.ID)}>
                        {info?.customer?.surname} {info?.customer?.firstname}

                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

						<FormField control={form.control} name="car_status" render={({ field }) => (
							<FormItem>
								<FormLabel>Car Status</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="In stock">In stock</SelectItem>
									<SelectItem value="Sold">Sold</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
							</FormItem>
						)} />

						<FormField control={form.control} name="car_payment_status" render={({ field }) => (
							<FormItem>
								<FormLabel>Car Payment Status</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select payment status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Booked">Booked</SelectItem>
									<SelectItem value="Paid">Paid</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
							</FormItem>
						)} />

						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
