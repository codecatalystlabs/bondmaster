"use client";

import * as React from "react";
import { Plus, Edit, Trash2, FileText, Phone, MapPin, UserPlus, MoreHorizontal } from "lucide-react";
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
import { createCustomer, deleteCustomer, editCustomer, fetcher } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import toast from "react-hot-toast";
import { useState } from "react";
import { formatAmount } from "@/lib/utils";
import { CustomerContactsModal } from "@/components/customer-management/customer-contacts-modal";
import { CustomerAddModal } from "@/components/customer-management/customer-add-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
	upload_file: z.instanceof(File).optional(),
});

function CustomerStatementModal({
	customerId,
	isOpen,
	onClose,
}: {
	customerId: number;
	isOpen: boolean;
	onClose: () => void;
}) {
	const {
		data: statement,
		error,
		isLoading,
	} = useSWR(isOpen ? `/sale/statement/${customerId}` : null, fetcher);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Customer Statement</DialogTitle>
					<DialogDescription>
						Financial statement for customer
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="flex justify-center p-4">
						<Loader className="w-8 h-8" />
					</div>
				) : error ? (
					<div className="text-red-500">
						Error loading statement
					</div>
				) : statement ? (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<div className="font-medium">
								Customer Name:
							</div>
							<div>{statement.data.customer_name}</div>

							<div className="font-medium">
								Total Sales:
							</div>
							<div>
								{formatAmount(
									statement.data.total_sales,
									""
								)}
							</div>

							<div className="font-medium">
								Total Paid:
							</div>
							<div>
								{formatAmount(
									statement.data.total_paid,
									""
								)}
							</div>

							<div className="font-medium">
								Outstanding Balance:
							</div>
							<div
								className={
									statement.data.total_outstanding >
									0
										? "text-red-500 font-bold"
										: "text-green-500"
								}
							>
								{formatAmount(
									statement.data.total_outstanding,
									""
								)}
							</div>
						</div>

						{statement.data.sales &&
						statement.data.sales.length > 0 ? (
							<div className="mt-4">
								<h3 className="font-semibold mb-2">
									Sales History
								</h3>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>
												Date
											</TableHead>
											<TableHead>
												Amount
											</TableHead>
											<TableHead>
												Status
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{statement.data.sales.map(
											(sale: any) => (
												<TableRow
													key={sale.ID}
												>
													<TableCell>
														{new Date(
															sale.sale_date
														).toLocaleDateString()}
													</TableCell>
													<TableCell>
														{formatAmount(
															sale.total_price,
															""
														)}
													</TableCell>
													<TableCell>
														<span
															className={
																sale.payment_status ===
																"Paid"
																	? "text-green-500"
																	: "text-red-500"
															}
														>
															{
																sale.payment_status
															}
														</span>
													</TableCell>
												</TableRow>
											)
										)}
									</TableBody>
								</Table>
							</div>
						) : (
							<p className="text-muted-foreground">
								No sales history available
							</p>
						)}
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

export function CustomerManagement() {
	const [search, setSearch] = React.useState("");
	const [gender, setGender] = React.useState("");
	const [customers, setCustomers] = React.useState<Customer[]>([]);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const [editingCustomer, setEditingCustomer] =
		React.useState<CustomerResponse | null>(null);
	const [selectedCustomerId, setSelectedCustomerId] = useState<
		number | null
	>(null);
	const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
	const [selectedContactCustomerId, setSelectedContactCustomerId] = useState<
		number | null
	>(null);
	const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
	const [addModalType, setAddModalType] = useState<"contact" | "address" | null>(null);
	const [selectedCustomerForAdd, setSelectedCustomerForAdd] = useState<Customer | null>(null);
	const [selectedCustomerContacts, setSelectedCustomerContacts] = useState<any[]>([]);
	const [selectedCustomerAddresses, setSelectedCustomerAddresses] = useState<any[]>([]);

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
			upload_file: undefined,
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
			toast.error("An error occurred");
			console.error("Error submitting form:", error);
		}
	}

	const handleDeleteCustomer = async () => {
		console.log(editingCustomer, "AM THE USERRERERERER");
		const response = await deleteCustomer(
			`${BASE_URL}/customer/${editingCustomer?.ID}`
		);

		mutate(`${BASE_URL}/customers`);
		if (response.data) {
			toast.success("Customer deleted successfully");
		}
	};

	const filteredCustomers = customerList?.data?.filter((info: any) => {
		return search
			? info?.customer?.surname
					.toLowerCase()
					.includes(search.toLowerCase()) ||
					info?.customer?.firstname
						.toLowerCase()
						.includes(search.toLowerCase())
			: true;
	});

	return (
		<>
			{isLoading ? (
				<Loader className="w-8 h-8" />
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

											<FormField
												control={
													form.control
												}
												name="upload_file"
												render={({
													field,
												}) => (
													<FormItem>
														<FormLabel>
															Upload
															File
														</FormLabel>
														<FormControl>
															<Input
																type="file"
																onChange={(
																	e
																) => {
																	const file =
																		e
																			.target
																			.files?.[0];
																	field.onChange(
																		file
																	);
																}}
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
											<Loader className="w-8 h-8" />
										) : null}
										{isLoading
											? "Saving..."
											: "Save"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
					<div className="mb-4 flex space-x-4">
						<Input
							placeholder="Search by name"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
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
										<Loader className="w-8 h-8" />
									</TableCell>
								</TableRow>
							) : (
								filteredCustomers?.map(
									(item: DataItem) => (
										<TableRow
											key={item?.customer?.ID}
										>
											<TableCell>
												{`${
													item?.customer
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
													item?.customer
														?.nationality
												}
											</TableCell>
											<TableCell>
												{
													item?.customer
														?.age
												}
											</TableCell>
											<TableCell>
												{
													item?.customer
														?.email
												}
											</TableCell>
											<TableCell>
												{
													item?.customer
														?.telephone
												}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														
														<DropdownMenuItem 
															onClick={() => {
																setSelectedCustomerId(item.customer.ID);
																setIsStatementModalOpen(true);
															}}
														>
															<FileText className="h-4 w-4 mr-2" />
															<span>View Statement</span>
														</DropdownMenuItem>
														
														<DropdownMenuItem
															onClick={() => {
																const customerData = customerList?.data?.find(
																	(item: any) => item.customer.ID === item.customer.ID
																);
																
																setSelectedContactCustomerId(item.customer.ID);
																setSelectedCustomerContacts(customerData?.contacts || []);
																setSelectedCustomerAddresses(customerData?.addresses || []);
																setIsContactsModalOpen(true);
															}}
														>
															<Phone className="h-4 w-4 mr-2" />
															<span>View Contacts</span>
														</DropdownMenuItem>
														
														<DropdownMenuItem
															onClick={() => {
																setSelectedCustomerForAdd(item.customer);
																setAddModalType("contact");
															}}
														>
															<UserPlus className="h-4 w-4 mr-2" />
															<span>Add Contact</span>
														</DropdownMenuItem>
														
														<DropdownMenuItem
															onClick={() => {
																setSelectedCustomerForAdd(item.customer);
																setAddModalType("address");
															}}
														>
															<MapPin className="h-4 w-4 mr-2" />
															<span>Add Address</span>
														</DropdownMenuItem>
														
														<DropdownMenuItem
															onClick={() => {
																setEditingCustomer({
																	...item.customer,
																});
																setIsDialogOpen(true);
															}}
														>
															<Edit className="h-4 w-4 mr-2" />
															<span>Edit Customer</span>
														</DropdownMenuItem>
														
														<DropdownMenuSeparator />
														
														<DropdownMenuItem
															onClick={() => {
																setEditingCustomer({
																	...item.customer,
																});
																const result = confirm("Are you sure you want to delete this customer? This action cannot be undone.");
																if (result) {
																	handleDeleteCustomer();
																}
															}}
															className="text-red-600"
														>
															<Trash2 className="h-4 w-4 mr-2" />
															<span>Delete Customer</span>
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									)
								)
							)}
						</TableBody>
					</Table>
				</div>
			)}
			{selectedCustomerId && (
				<CustomerStatementModal
					customerId={selectedCustomerId}
					isOpen={isStatementModalOpen}
					onClose={() => setIsStatementModalOpen(false)}
				/>
			)}
			{selectedContactCustomerId && (
				<CustomerContactsModal
					customerId={selectedContactCustomerId}
					customerName={
						customerList?.data?.find(
							(item: any) =>
								item.customer.ID ===
								selectedContactCustomerId
						)?.customer?.surname +
						" " +
						customerList?.data?.find(
							(item: any) =>
								item.customer.ID ===
								selectedContactCustomerId
						)?.customer?.firstname
					}
					contacts={selectedCustomerContacts}
					addresses={selectedCustomerAddresses}
					isOpen={isContactsModalOpen}
					onClose={() => setIsContactsModalOpen(false)}
					onDataChange={() => {
						// Refresh the main customer list when contacts/addresses change
						mutate('/customer');
					}}
				/>
			)}
			{addModalType && selectedCustomerForAdd && (
				<CustomerAddModal
					customer={selectedCustomerForAdd}
					type={addModalType}
					isOpen={addModalType !== null}
					onClose={() => setAddModalType(null)}
					onSuccess={() => {
						setAddModalType(null);
						if (selectedContactCustomerId === selectedCustomerForAdd.ID && isContactsModalOpen) {
							// Refresh contacts/addresses data if contacts modal is open
							mutate(`/customer/${selectedCustomerForAdd.ID}/contacts`);
							mutate(`/customer/${selectedCustomerForAdd.ID}/addresses`);
						}
					}}
				/>
			)}
		</>
	);
}
