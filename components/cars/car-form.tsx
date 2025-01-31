"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
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
import toast from "react-hot-toast";
import { Car } from "@/types/car";
import { addCar, fetcher } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import useSWR, { mutate } from "swr";

import { v4 as uuidv4 } from "uuid";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const formSchema = z.object({
	vin_number: z.string().min(17, {
		message: "VIN number must be 17 characters.",
	}),
	engine_number: z.string().min(1, "Engine number is required."),
	engine_capacity: z.string().min(1, "Engine capacity is required."),
	make: z.string().min(1, "Make is required."),
	model: z.string().min(1, "Model is required."),
	maxim_carry: z.number().min(1, "Maximum carry must be at least 1."),
	weight: z.number().min(0, "Weight must be a positive number."),
	gross_weight: z.number().min(0, "Gross weight must be a positive number."),
	ff_weight: z.number().min(0, "FF weight must be a positive number."),
	rr_weight: z.number().min(0, "RR weight must be a positive number."),
	fr_weight: z.number().min(0, "FR weight must be a positive number."),
	rf_weight: z.number().min(0, "RF weight must be a positive number."),
	weight_units: z.string().min(1, "Weight units are required."),
	length: z.number().min(0, "Length must be a positive number."),
	width: z.number().min(0, "Width must be a positive number."),
	height: z.number().min(0, "Height must be a positive number."),
	length_units: z.string().min(1, "Length units are required."),
	maunufacture_year: z.number().min(1900, "Year must be 1900 or later."),
	first_registration_year: z
		.number()
		.min(1900, "Year must be 1900 or later."),
	transmission: z.string().min(1, "Transmission is required."),
	body_type: z.string().min(1, "Body type is required."),
	colour: z.string().min(1, "Colour is required."),
	auction: z.string().min(1, "Auction is required."),
	currency: z.string().min(1, "Currency is required."),
	bid_price: z.number().min(0, "Bid price must be a positive number."),
	purchase_date: z.date(),
	from_company_id: z.number().min(1, "From company ID is required."),
	to_company_id: z.number().min(1, "To company ID is required."),
	destination: z.string().min(1, "Destination is required."),
	broker_name: z.string().min(1, "Broker name is required."),
	broker_number: z.string().min(1, "Broker number is required."),
	vat_tax: z.number().min(0, "VAT tax must be a positive number."),
	number_plate: z.string().min(1, "Number plate is required."),
	customer_id: z.number().min(1, "Customer ID is required."),
});
interface CarFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	car?: Car;
	onSubmit: (car: Car) => void;
}

export function CarForm({ open, onOpenChange, car, onSubmit }: CarFormProps) {
	const {
			data: weights,
			error:weightsError,
			isLoading:idLoadingWeights,
	} = useSWR(`${BASE_URL}/meta/weights`, fetcher);
	
	const {
		data: currencies,
		error: currencyError,
		isLoading: idLoadingCurrency,
	} = useSWR(`${BASE_URL}/meta/currency`, fetcher);
	const {
		data: lengths,
		error: lengthsError,
		isLoading: idLoadinglengths,
	} = useSWR(`${BASE_URL}/meta/lengths`, fetcher);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: car
			? {
					...car,
					purchase_date: new Date(car.purchase_date),
			  }
			: {
					vin_number: "",
					engine_number: "",
					engine_capacity: "",
					make: "",
					model: "",
					maxim_carry: 0,
					weight: 0,
					gross_weight: 0,
					ff_weight: 0,
					rr_weight: 0,
					fr_weight: 0,
					rf_weight: 0,
					weight_units: "kg",
					length: 0,
					width: 0,
					height: 0,
					length_units: "mm",
					maunufacture_year: new Date().getFullYear(),
					first_registration_year: new Date().getFullYear(),
					transmission: "",
					body_type: "",
					colour: "",
					auction: "",
					currency: "USD",
					bid_price: 0,
					purchase_date: new Date(),
					from_company_id: 0,
					to_company_id: 0,
					destination: "",
					broker_name: "",
					broker_number: "",
					vat_tax: 0,
					number_plate: "",
					customer_id: 0,
			  },
	});

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		const submittedCar: Car = {
			car_uuid: car?.car_uuid || crypto.randomUUID(),
			...values,
			purchase_date: values.purchase_date.toISOString().split("T")[0],
			created_by: car?.created_by || "admin",
			updated_by: "admin",
        };

         try {
            const response = await addCar({
                url: `${BASE_URL}/car`,
                carInfo: submittedCar,
            });

            mutate(`${BASE_URL}/cars`);
            if (response.data) {
                toast.success("Car added successfully");
            }
        } catch (error: any) {
            toast.error(error || "An error occurred");
            console.error("Error submitting form:", error);
        }

        
		onSubmit(submittedCar);
		onOpenChange(false);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[900px] sm:h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{car ? "Edit Car" : "Add New Car"}
					</DialogTitle>
					<DialogDescription>
						{car
							? "Edit the car details."
							: "Add a new car to your inventory. Fill in all the required information."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8"
					>
						<div className="grid gap-4 py-4 md:grid-cols-4">
							{/* VIN Number */}
							<FormField
								control={form.control}
								name="vin_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											VIN Number
										</FormLabel>
										<FormControl>
											<Input
												placeholder="1HGCM82633A123456"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Engine Number */}
							<FormField
								control={form.control}
								name="engine_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Engine Number
										</FormLabel>
										<FormControl>
											<Input
												placeholder="EN123456789"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Engine Capacity */}
							<FormField
								control={form.control}
								name="engine_capacity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Engine Capacity
										</FormLabel>
										<FormControl>
											<Input
												placeholder="2000cc"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Make */}
							<FormField
								control={form.control}
								name="make"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Make</FormLabel>
										<FormControl>
											<Input
												placeholder="Toyota"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Model */}
							<FormField
								control={form.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Model</FormLabel>
										<FormControl>
											<Input
												placeholder="Corolla"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Maximum Carry */}
							<FormField
								control={form.control}
								name="maxim_carry"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Maximum Carry
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseInt(
															e
																.target
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
							{/* Weight */}
							<FormField
								control={form.control}
								name="weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Weight</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* Gross Weight */}
							<FormField
								control={form.control}
								name="gross_weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Gross Weight
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* FF Weight */}
							<FormField
								control={form.control}
								name="ff_weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											FF Weight
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* RR Weight */}
							<FormField
								control={form.control}
								name="rr_weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											RR Weight
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* FR Weight */}
							<FormField
								control={form.control}
								name="fr_weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											FR Weight
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* RF Weight */}
							<FormField
								control={form.control}
								name="rf_weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											RF Weight
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* Weight Units */}

							<FormField
								control={form.control}
								name="weight_units"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Weight Units
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
													<SelectValue placeholder="Select weight units" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{weights?.data?.map(
													(
														weight: any
													) => (
														<SelectItem
															key={
																weight.ID
															}
															value={weight.ID.toString()}
														>
															{
																weight.name
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

							{/* Weight Units */}
							{/* Length */}
							<FormField
								control={form.control}
								name="length_units"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Length</FormLabel>
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
													<SelectValue placeholder="Select length units" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{lengths?.data?.map(
													(
														length: any
													) => (
														<SelectItem
															key={
																length.ID
															}
															value={length.ID.toString()}
														>
															{
																length.name
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
							{/* Width */}
							<FormField
								control={form.control}
								name="width"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Width</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* Height */}
							<FormField
								control={form.control}
								name="height"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Height</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* Length Units */}
							<FormField
								control={form.control}
								name="length_units"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Length Units
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
													<SelectValue placeholder="Select length units" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="mm">
													mm
												</SelectItem>
												<SelectItem value="in">
													in
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Manufacture Year */}
							<FormField
								control={form.control}
								name="maunufacture_year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Manufacture Year
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseInt(
															e
																.target
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
							{/* First Registration Year */}
							<FormField
								control={form.control}
								name="first_registration_year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											First Registration Year
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseInt(
															e
																.target
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
							{/* Transmission */}
							<FormField
								control={form.control}
								name="transmission"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Transmission
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
													<SelectValue placeholder="Select transmission" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Automatic">
													Automatic
												</SelectItem>
												<SelectItem value="Manual">
													Manual
												</SelectItem>
												<SelectItem value="CVT">
													CVT
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Body Type */}
							<FormField
								control={form.control}
								name="body_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Body Type
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Sedan"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Colour */}
							<FormField
								control={form.control}
								name="colour"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Colour</FormLabel>
										<FormControl>
											<Input
												placeholder="White"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Auction */}
							<FormField
								control={form.control}
								name="auction"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Auction</FormLabel>
										<FormControl>
											<Input
												placeholder="Japan Auction"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Currency */}
							{/* Currency Dropdown */}
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
													<SelectValue placeholder="Select a currency" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{currencies?.data?.map(
													(
														currency: any
													) => (
														<SelectItem
															key={
																currency.ID
															}
															value={currency.ID.toString()}
														>
															{`${currency.symbol} - ${currency.name}`}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Bid Price */}
							<FormField
								control={form.control}
								name="bid_price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Bid Price
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* Purchase Date */}
							<FormField
								control={form.control}
								name="purchase_date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Purchase Date
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
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
																field.value,
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
													}
													onSelect={
														field.onChange
													}
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
							{/* From Company ID */}
							<FormField
								control={form.control}
								name="from_company_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											From Company ID
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseInt(
															e
																.target
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
							{/* To Company ID */}
							<FormField
								control={form.control}
								name="to_company_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											To Company ID
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseInt(
															e
																.target
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
							{/* Destination */}
							<FormField
								control={form.control}
								name="destination"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Destination
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Kampala, Uganda"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Broker Name */}
							<FormField
								control={form.control}
								name="broker_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Broker Name
										</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Broker Number */}
							<FormField
								control={form.control}
								name="broker_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Broker Number
										</FormLabel>
										<FormControl>
											<Input
												placeholder="+256700123456"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* VAT Tax */}
							<FormField
								control={form.control}
								name="vat_tax"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											VAT Tax (%)
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseFloat(
															e
																.target
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
							{/* Number Plate */}
							<FormField
								control={form.control}
								name="number_plate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Number Plate
										</FormLabel>
										<FormControl>
											<Input
												placeholder="UAA 123X"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Customer ID */}
							<FormField
								control={form.control}
								name="customer_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Customer ID
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														parseInt(
															e
																.target
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
						</div>
						<DialogFooter>
							<Button type="submit">
								{car ? "Update Car" : "Add Car"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

