"use client";

import { Button } from "@/components/ui/button";
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
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { NewSale } from "@/types/sale";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { addCarSaleJapan, fetcher } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import * as z from "zod";
import useUserStore from "@/app/store/userStore";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ICompany } from "@/types/company";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
	car_id: z.number(),
	company_id: z.number(),
	auction_date: z.string(),
	auction: z.string(),
	price: z.number().positive("Price must be positive"),
	vat_tax: z.number().positive("VAT must be positive"),
	recycle_fee: z.number().positive("Recycle must be positive"),
});

export default function CarSalePage() {
	const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
	const user = useUserStore((state) => state.user);

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [filterCompany, setFilterCompany] = useState("");
	const [filterCar, setFilterCar] = useState("");
	const [sortBy, setSortBy] = useState("auction_date");
	const [sortOrder, setSortOrder] = useState("desc");

	const {
		data: salesData,
		error,
		isLoading,
		mutate: mutateSales,
	} = useSWR<{ data: any; total: number }>(
		`${BASE_URL}/auction-sales?page=${page}&limit=${limit}&company=${filterCompany}&car=${filterCar}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
		fetcher
		);
	
	console.log(salesData?.data, "salesData");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			car_id: 0,
			company_id: 0,
			auction_date: "",
			auction: "",
			price: 0,
			vat_tax: 0,
			recycle_fee: 0,
		},
	});

	const {
		data: companiesData,
		error: getCompanyError,
		isLoading: isLoadingCompanies,
	} = useSWR<{ data: ICompany[] }>(`${BASE_URL}/companies`, fetcher);

	const {
		data: carList,
		error: carListError,
		isLoading: carListLoading,
	} = useSWR(`${BASE_URL}/cars`, fetcher);

	const handleAddSale = async (values: z.infer<typeof formSchema>) => {
		const payload = {
			...values,
			created_by: user?.username,
			updated_by: user?.username,
		};

		try {
			const res = await addCarSaleJapan({
				url: `${BASE_URL}/auction-sale`,
				sale: payload,
			});

			if (res?.status === "success") toast.success(res?.message);
			setIsAddSaleOpen(false);
			form.reset();
			mutateSales();
		} catch (error) {
			console.error("Error adding sale:", error);
			toast.error("Failed to add sale");
		}
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
		setPage(1);
	};

	const handleSort = (column: string) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	if (error || getCompanyError || carListError)
		return <div>Failed to load</div>;
	if (isLoading || isLoadingCompanies || carListLoading)
		return <Loader2 className="h-8 w-8 animate-spin" />;

	return (
		<div className="p-2">
			<div className="mb-4 flex justify-between items-center">
				<Dialog
					open={isAddSaleOpen}
					onOpenChange={setIsAddSaleOpen}
				>
					<DialogTrigger asChild>
						<Button>Add New Sale</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>Add New Sale</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(
									handleAddSale
								)}
								className="grid grid-cols-2 gap-4"
							>
								<FormField
									control={form.control}
									name="car_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Car
											</FormLabel>
											<Select
												onValueChange={(
													value
												) =>
													field.onChange(
														Number(
															value
														)
													)
												}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select car" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{carList?.data.map(
														(
															car: any
														) => (
															<SelectItem
																key={
																	car
																		?.car
																		.ID
																}
																value={car?.car.ID.toString()}
															>
																{
																	car
																		.car
																		.make
																}{" "}
																{
																	car
																		.car
																		.car_model
																}{" "}
																-{" "}
																{
																	car
																		.car
																		.chasis_number
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
								<FormField
									control={form.control}
									name="company_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Company
											</FormLabel>
											<Select
												onValueChange={(
													value
												) =>
													field.onChange(
														Number(
															value
														)
													)
												}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select company" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{companiesData?.data.map(
														(
															company: ICompany
														) => (
															<SelectItem
																key={
																	company.ID
																}
																value={company.ID.toString()}
															>
																{
																	company.name
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
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Price
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													onChange={(
														e
													) =>
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
									name="vat_tax"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												VAT Tax
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													onChange={(
														e
													) =>
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
									name="recycle_fee"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Recycle Fee
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													onChange={(
														e
													) =>
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
									name="auction_date"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Auction Date
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
									control={form.control}
									name="auction"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Auction
											</FormLabel>
											<FormControl>
												<Input
													type="text"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="col-span-2"
								>
									Add Sale
								</Button>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
				{/* <div className="flex gap-2">
					<Select
						onValueChange={(value) => setFilterCompany(value)}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by Company" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="0">
								All Companies
							</SelectItem>
							{companiesData?.data.map(
								(company: ICompany) => (
									<SelectItem
										key={company.ID}
										value={company.ID.toString()}
									>
										{company.name}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
					<Select onValueChange={(value) => setFilterCar(value)}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by Car" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="0">All Cars</SelectItem>
							{carList?.data.map((car: any) => (
								<SelectItem
									key={car?.car.ID}
									value={car?.car.ID.toString()}
								>
									{car.car.make} {car.car.car_model}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div> */}
			</div>
			{salesData?.data && salesData.data.length > 0 ? (
				<>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead
									onClick={() =>
										handleSort("car_model")
									}
								>
									Car
								</TableHead>
								<TableHead
									onClick={() =>
										handleSort("company_name")
									}
								>
									Company
								</TableHead>
								<TableHead
									onClick={() => handleSort("price")}
								>
									Price
								</TableHead>
								<TableHead
									onClick={() =>
										handleSort("vat_tax")
									}
								>
									VAT Tax
								</TableHead>
								<TableHead
									onClick={() =>
										handleSort("recycle_fee")
									}
								>
									Recycle Fee
								</TableHead>
								<TableHead
									onClick={() =>
										handleSort("auction_date")
									}
								>
									Auction Date
								</TableHead>
								<TableHead
									onClick={() =>
										handleSort("auction")
									}
								>
									Auction
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{salesData.data.map(
								(sale: any, index: number) => (
									<TableRow key={index}>
										<TableCell>
											{sale?.Car.car_model}{" "}
											{sale?.Car.car?.make}
										</TableCell>
										<TableCell>
											{sale?.Company.company?.name}
										</TableCell>
										<TableCell>
											{sale.price.toLocaleString()}
										</TableCell>
										<TableCell>
											{sale.vat_tax.toLocaleString()}
										</TableCell>
										<TableCell>
											{sale.recycle_fee.toLocaleString()}
										</TableCell>
										<TableCell>
											{new Date(
												sale.auction_date
											).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{sale.auction}
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
					<div className="flex justify-between items-center mt-4">
						<div>
							<Select
								onValueChange={(value) =>
									handleLimitChange(Number(value))
								}
							>
								<SelectTrigger className="w-[100px]">
									<SelectValue
										placeholder={limit.toString()}
									/>
								</SelectTrigger>
								<SelectContent>
									{[5, 10, 20, 50,100,1000,50000,10000000].map(
										(pageSize) => (
											<SelectItem
												key={pageSize}
												value={pageSize.toString()}
											>
												{pageSize}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>
						<div className="flex gap-2">
							<Button
								onClick={() =>
									handlePageChange(page - 1)
								}
								disabled={page === 1}
							>
								Previous
							</Button>
							<Button
								onClick={() =>
									handlePageChange(page + 1)
								}
								disabled={
									page * limit >=
									(salesData.total || 0)
								}
							>
								Next
							</Button>
						</div>
					</div>
				</>
			) : (
				<div className="text-center py-4">No sales found.</div>
			)}
		</div>
	);
}
