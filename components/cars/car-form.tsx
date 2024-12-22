"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Upload } from "lucide-react";
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
import { Car } from "@/types/car";

const formSchema = z.object({
	make: z.string().min(2, {
		message: "Make must be at least 2 characters.",
	}),
	model: z.string().min(2, {
		message: "Model must be at least 2 characters.",
	}),
	year: z.date(),
	chassisNumber: z.string().min(17, {
		message: "Chassis number must be 17 characters.",
	}),
	engineCapacity: z.string().min(2, {
		message: "Engine capacity is required.",
	}),
	mileage: z.number().min(0, {
		message: "Mileage must be a positive number.",
	}),
	condition: z.enum(["excellent", "good", "fair", "poor"]),
	price: z.number().min(0, {
		message: "Price must be a positive number.",
	}),
});

interface CarFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	car?: Car | null;
}

export function CarForm({ open, onOpenChange }: CarFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			make: "",
			model: "",
			year: new Date(),
			chassisNumber: "",
			engineCapacity: "",
			mileage: 0,
			condition: "good",
			price: 0,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		onOpenChange(false);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[645px]">
				<DialogHeader>
					<DialogTitle>Add New Car</DialogTitle>
					<DialogDescription>
						Add a new car to your inventory. Fill in all the
						required information.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<div className="grid gap-4 py-4 md:grid-cols-2">
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
							<FormField
								control={form.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Model</FormLabel>
										<FormControl>
											<Input
												placeholder="Camry"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="year"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Year</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={
															"outline"
														}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value &&
																"text-muted-foreground"
														)}
													>
														{field.value ? (
															format(
																field.value,
																"yyyy"
															)
														) : (
															<span>
																Pick
																a
																year
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
							<FormField
								control={form.control}
								name="chassisNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Chassis Number
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
							<FormField
								control={form.control}
								name="engineCapacity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Engine Capacity
										</FormLabel>
										<FormControl>
											<Input
												placeholder="2.5L"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="mileage"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mileage</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="45000"
												{...field}
												onChange={(e) =>
													field.onChange(
														Number(
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
							<FormField
								control={form.control}
								name="condition"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Condition
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
													<SelectValue placeholder="Select condition" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="excellent">
													Excellent
												</SelectItem>
												<SelectItem value="good">
													Good
												</SelectItem>
												<SelectItem value="fair">
													Fair
												</SelectItem>
												<SelectItem value="poor">
													Poor
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="25000"
												{...field}
												onChange={(e) =>
													field.onChange(
														Number(
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
						<div className="space-y-4">
							<div>
								<h4 className="text-sm font-medium">
									Documents
								</h4>
								<div className="mt-2 flex items-center gap-4">
									<Button
										type="button"
										variant="outline"
									>
										<Upload className="mr-2 h-4 w-4" />
										Upload Photos
									</Button>
									<Button
										type="button"
										variant="outline"
									>
										<Upload className="mr-2 h-4 w-4" />
										Upload Inspection Report
									</Button>
									<Button
										type="button"
										variant="outline"
									>
										<Upload className="mr-2 h-4 w-4" />
										Upload Documents
									</Button>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Save Car</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
