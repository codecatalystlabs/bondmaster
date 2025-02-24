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
import { Loader } from "@/components/ui/loader";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { useCallback } from "react";
import { debounce } from "lodash";
import type { Car } from "@/types/car";

const formSchema = z.object({
	car_id: z.number(),
	company_id: z.number(),
	auction_date: z.string().min(1, "Auction date is required"),
	auction: z.string().min(1, "Auction name is required"),
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
			auction_date: new Date().toISOString().split("T")[0],
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

	const [searchChasis, setSearchChasis] = useState("");
	const [selectedCar, setSelectedCar] = useState<Car | null>(null);

	const { data: searchedCarData, error: searchError } = useSWR(
		searchChasis ? `/car/vin/${searchChasis}` : null,
		fetcher
	);

	const debouncedSearch = useCallback(
		debounce((value: string) => handleSearch(value), 500),
		[]
	);

	const handleSearch = async (value: string) => {
		setSearchChasis(value);

		if (value.length >= 5) {
			try {
				const carData = await fetcher(`/car/vin/${value}`);
				if (carData?.data?.car) {
					form.setValue('car_id', carData.data.car.ID);
					setSelectedCar(carData.data.car);
					toast.success("Car found!");
				}
			} catch (error) {
				console.error("Error searching car:", error);
			}
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchChasis(value);
		debouncedSearch(value);
	};

	const handleAddSale = async (values: z.infer<typeof formSchema>) => {
		if (!values.auction_date) {
			toast.error("Auction date is required");
			return;
		}

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

			if (res?.status === "success") {
				toast.success(res?.message);
				setIsAddSaleOpen(false);
				form.reset();
				mutateSales();
			} else {
				toast.error(res?.message || "Failed to add sale");
			}
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

	const totalPages = Math.ceil((salesData?.total || 0) / limit);
	const startIndex = (page - 1) * limit + 1;
	const endIndex = Math.min(page * limit, salesData?.total || 0);

	if (error || getCompanyError || carListError)
		return <div>Failed to load</div>;
	if (isLoading || isLoadingCompanies || carListLoading) return <Loader />;

	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Car Sales</CardTitle>
							<CardDescription>
								Search for a car by VIN/chassis number and add sale details
							</CardDescription>
						</div>
						<Button onClick={() => setIsAddSaleOpen(true)}>
							<Plus className="mr-2 h-4 w-4" />
							Add Sale
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6">
						<Input
							placeholder="Search car by VIN/chassis number..."
							value={searchChasis}
							onChange={handleSearchInputChange}
							className="max-w-md"
						/>
					</div>

					{selectedCar && (
						<div className="mb-6 p-4 border rounded-md bg-muted">
							<h3 className="font-medium mb-2">Selected Car:</h3>
							<div className="grid grid-cols-2 gap-4">
								<p><strong>Make:</strong> {selectedCar.car_make}</p>
								<p><strong>Model:</strong> {selectedCar.car_model}</p>
								<p><strong>Chassis:</strong> {selectedCar.chasis_number}</p>
								<p><strong>Year:</strong> {selectedCar.manufacture_year}</p>
							</div>
						</div>
					)}

					{isLoading ? (
						<Loader />
					) : salesData?.data && salesData.data.length > 0 ? (
						<>
							<div className="flex items-center justify-between py-4">
								<Input
									placeholder="Filter cars..."
									value={filterCar}
									onChange={(e) =>
										setFilterCar(e.target.value)
									}
									className="max-w-sm"
								/>
								<div className="flex space-x-2">
									<Select
										value={limit.toString()}
										onValueChange={(value) =>
											handleLimitChange(
												Number(value)
											)
										}
									>
										<SelectTrigger className="w-[100px]">
											<SelectValue
												placeholder={limit.toString()}
											/>
										</SelectTrigger>
										<SelectContent>
											{[
												5, 10, 20, 50, 100,
											].map((pageSize) => (
												<SelectItem
													key={pageSize}
													value={pageSize.toString()}
												>
													{pageSize}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead
												onClick={() =>
													handleSort(
														"Car.car_model"
													)
												}
											>
												Car Details
											</TableHead>
											<TableHead
												onClick={() =>
													handleSort(
														"Company.name"
													)
												}
											>
												Company
											</TableHead>
											<TableHead
												onClick={() =>
													handleSort(
														"price"
													)
												}
											>
												Price
											</TableHead>
											<TableHead
												onClick={() =>
													handleSort(
														"vat_tax"
													)
												}
											>
												VAT
											</TableHead>
											<TableHead
												onClick={() =>
													handleSort(
														"recycle_fee"
													)
												}
											>
												Recycle Fee
											</TableHead>
											<TableHead
												onClick={() =>
													handleSort(
														"auction_date"
													)
												}
											>
												Auction Date
											</TableHead>
											<TableHead
												onClick={() =>
													handleSort(
														"auction"
													)
												}
											>
												Auction
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{salesData.data.map(
											(
												sale: any,
												index: number
											) => (
												<TableRow
													key={index}
												>
													<TableCell>
														{
															sale
																?.Car
																.car_model
														}{" "}
														{
															sale
																?.Car
																.car
																?.make
														}
													</TableCell>
													<TableCell>
														{
															sale
																?.Company
																.company
																?.name
														}
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
														{
															sale.auction
														}
													</TableCell>
												</TableRow>
											)
										)}
									</TableBody>
								</Table>
							</div>

							<div className="flex items-center justify-between py-4">
								<div className="flex items-center gap-2">
									<Select
										value={limit.toString()}
										onValueChange={(value) =>
											handleLimitChange(
												Number(value)
											)
										}
									>
										<SelectTrigger className="w-[80px]">
											<SelectValue
												placeholder={limit.toString()}
											/>
										</SelectTrigger>
										<SelectContent>
											{[
												5, 10, 20, 50, 100,
											].map((pageSize) => (
												<SelectItem
													key={pageSize}
													value={pageSize.toString()}
												>
													{pageSize}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-sm text-muted-foreground">
										Showing {startIndex} to{" "}
										{endIndex} of{" "}
										{salesData.total} entries
									</p>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(1)
										}
										disabled={page === 1}
									>
										First
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(
												page - 1
											)
										}
										disabled={page === 1}
									>
										Previous
									</Button>
									<span className="text-sm">
										Page {page} of {totalPages}
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(
												page + 1
											)
										}
										disabled={page >= totalPages}
									>
										Next
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(
												totalPages
											)
										}
										disabled={page >= totalPages}
									>
										Last
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="text-center py-4">
							No sales found.
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={isAddSaleOpen}
				onOpenChange={setIsAddSaleOpen}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Add New Sale</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleAddSale)}
							className="grid grid-cols-2 gap-4"
						>
							<FormField
								control={form.control}
								name="car_id"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Search Car</FormLabel>
										<FormControl>
											<Input
												placeholder="Search by VIN/chassis number"
												value={searchChasis}
												onChange={handleSearchInputChange}
											/>
										</FormControl>
										{selectedCar && (
											<div className="mt-2 p-4 border rounded-md">
												<p className="font-medium">Selected: {selectedCar.car_make} {selectedCar.car_model} - {selectedCar.chasis_number}</p>
											</div>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="company_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company</FormLabel>
										<Select
											onValueChange={(value) =>
												field.onChange(
													Number(value)
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
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type="number"
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
								name="vat_tax"
								render={({ field }) => (
									<FormItem>
										<FormLabel>VAT Tax</FormLabel>
										<FormControl>
											<Input
												type="number"
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
												required
												value={
													field.value ||
													""
												}
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
										<FormLabel>Auction</FormLabel>
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
		</div>
	);
}
