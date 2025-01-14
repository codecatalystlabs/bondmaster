"use client";

import * as React from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Customer, CustomerResponse, DataItem } from "@/types/customer";
import { Loader } from "@/components/ui/loader";
import useSWR, { mutate } from "swr";
import { createCustomer, editCustomer, fetcher } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";

const formSchema = z.object({
	surname: z.string().min(1, "Surname is required."),
	firstname: z.string().min(1, "Firstname is required."),
	othername: z.string().optional(),
	gender: z.enum(["Male", "Female", "Other"]),
	nationality: z.string().min(1, "Nationality is required."),
	age: z.number().min(0, "Age must be a positive number."),
	dob: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}$/,
			"Date of birth must be in YYYY-MM-DD format."
		),
	telephone: z.string().min(10, "Telephone must be at least 10 characters."),
	email: z.string().email("Invalid email address."),
	nin: z.string().min(1, "NIN is required."),
});

export function CustomerManagement() {
	const [customers, setCustomers] = React.useState<Customer[]>([]);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const [editingCustomer, setEditingCustomer] =
		React.useState<CustomerResponse | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			surname: "",
			firstname: "",
			othername: "",
			gender: "Male" as "Male" | "Female" | "Other",
			nationality: "",
			age: 0,
			dob: "",
			telephone: "",
			email: "",
			nin: "",
		},
	});

	React.useEffect(() => {
		if (editingCustomer) {
			form.reset({
				surname: editingCustomer.surname,
				firstname: editingCustomer.firstname,
				othername: editingCustomer.othername,
				gender: editingCustomer.gender as
					| "Male"
					| "Female"
					| "Other",
				nationality: editingCustomer.nationality,
				age: editingCustomer.age,
				dob: editingCustomer.dob,
				telephone: editingCustomer.telephone,
				email: editingCustomer.email,
				nin: editingCustomer.nin,
			});
		} else {
			form.reset({
				surname: "",
				firstname: "",
				othername: "",
				gender: "Male",
				nationality: "",
				age: 0,
				dob: "",
				telephone: "",
				email: "",
				nin: "",
			});
		}
	}, [editingCustomer, form]);

	const {
		data: customerList,
		error,
		isLoading,
	} = useSWR(`${BASE_URL}/customers`, fetcher);

	console.log(customerList?.data, "customerList");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const userPayload: Customer = {
			...values,
			created_by: "admin",
			updated_by: "admin",
		};

		try {
			const updatedCustomer: Customer = {
				...editCustomer,
				...values,
				created_by: "admin",
				updated_by: "admin",
			};
			if (editingCustomer) {
				// console.log(editCustomer, "######");
				const response = await editCustomer({
					url: `${BASE_URL}/customer/${editingCustomer.ID}`,
					customerInfo: updatedCustomer,
				});
				mutate(`${BASE_URL}/customers`);
				if (response.data) {
					toast.success("User updated successfully");
				}
			} else {
				// Create new user
				const response = await createCustomer({
					url: `${BASE_URL}/customer`,
					customerInfo: userPayload,
				});

				mutate(`${BASE_URL}/customers`);
				if (response.data) {
					toast.success("User created successfully");
				}
			}

			setIsDialogOpen(false);
			setEditingCustomer(null);
			form.reset();
		} catch (error: any) {
			toast.error(error || "An error occurred");
			console.error("Error submitting form:", error);
		}
	}

	const deleteCustomer = (customerUuid: string) => {
		setCustomers(
			customers.filter(
				(customer) => customer.customer_uuid !== customerUuid
			)
		);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">
							Customer Management
						</h2>
						<Dialog
							open={isDialogOpen}
							onOpenChange={setIsDialogOpen}
						>
							<DialogTrigger asChild>
								<Button
									onClick={() =>
										setEditingCustomer(null)
									}
								>
									<Plus className="mr-2 h-4 w-4" />{" "}
									Add Customer
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[700px]">
								<DialogHeader>
									<DialogTitle>
										{editingCustomer
											? "Edit Customer"
											: "Add New Customer"}
									</DialogTitle>
									<DialogDescription>
										{editingCustomer
											? "Edit customer details."
											: "Create a new customer account."}{" "}
										Click save when you're done.
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(
											onSubmit
										)}
										className="space-y-4"
									>
										<div className="grid grid-cols-2 gap-4">
											<FormField
												control={
													form.control
												}
												name="surname"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Surname
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
											<FormField
												control={
													form.control
												}
												name="firstname"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Firstname
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
											<FormField
												control={
													form.control
												}
												name="othername"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Other
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
											<FormField
												control={
													form.control
												}
												name="gender"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Gender
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
																	<SelectValue placeholder="Select gender" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="Male">
																	Male
																</SelectItem>
																<SelectItem value="Female">
																	Female
																</SelectItem>
																<SelectItem value="Other">
																	Other
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={
													form.control
												}
												name="nationality"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Nationality
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
											<FormField
												control={
													form.control
												}
												name="age"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Age
														</FormLabel>
														<FormControl>
															<Input
																type="number"
																{...field}
																onChange={(
																	e
																) =>
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
											<FormField
												control={
													form.control
												}
												name="dob"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Date
															of
															Birth
														</FormLabel>
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
												control={
													form.control
												}
												name="telephone"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Telephone
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
											<FormField
												control={
													form.control
												}
												name="email"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Email
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
											<FormField
												control={
													form.control
												}
												name="nin"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															NIN
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
										</div>
									</form>
								</Form>
								<DialogFooter>
									<Button
										type="submit"
										onClick={form.handleSubmit(
											onSubmit
										)}
										disabled={isLoading}
									>
										{isLoading ? (
											<Loader />
										) : null}
										{isLoading
											? "Saving..."
											: "Save"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Gender</TableHead>
								<TableHead>Nationality</TableHead>
								<TableHead>Age</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Telephone</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="h-24 text-center"
									>
										<Loader />
									</TableCell>
								</TableRow>
							) : (
								customerList?.data?.map(
									(item: DataItem) => (
										<TableRow
											key={item.customer.ID}
										>
											<TableCell>
												{`${
													item.customer
														?.surname
												} ${
													item.customer
														?.firstname
												} ${
													item.customer
														?.othername ||
													""
												}`.trim()}
											</TableCell>
											<TableCell>
												{
													item.customer
														?.gender
												}
											</TableCell>
											<TableCell>
												{
													item.customer
														?.nationality
												}
											</TableCell>
											<TableCell>
												{item.customer?.age}
											</TableCell>
											<TableCell>
												{
													item.customer
														?.email
												}
											</TableCell>
											<TableCell>
												{
													item.customer
														?.telephone
												}
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => {
															setEditingCustomer(
																{
																	...item.customer,
																}
															);
															setIsDialogOpen(
																true
															);
														}}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<AlertDialog>
														<AlertDialogTrigger
															asChild
														>
															<Button
																variant="ghost"
																size="icon"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Are
																	you
																	absolutely
																	sure?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	This
																	action
																	cannot
																	be
																	undone.
																	This
																	will
																	permanently
																	delete
																	the
																	customer
																	account
																	and
																	remove
																	their
																	data
																	from
																	our
																	servers.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>
																	Cancel
																</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		console.log(
																			"deleted"
																		)
																	}
																>
																	Delete
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</TableCell>
										</TableRow>
									)
								)
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</>
	);
}
