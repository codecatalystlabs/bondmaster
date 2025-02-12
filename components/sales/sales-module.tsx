"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaleForm } from "./sale-form";
import { SalesTable } from "./sales-table";
import { SalesVisualization } from "./sales-visualization";
import { EditSaleForm } from "./edit-sale-form";
import { Sale, Sale2 } from "@/types/sale";
import { Car } from "@/types/car";
import { Company } from "@/types/company";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import { addSale, fetcher } from "@/apis";
import useSWR, { mutate } from "swr";
import { BASE_URL } from "@/constants/baseUrl";

const mockCompanies: Company[] = [
	{
		id: "1",
		name: "Sheeraz Motors",
		contactPerson: "John Bukenya",
		email: "john@abcmotors.com",
		phone: "+1234567890",
		address: "123 Main St, Anytown, USA",
	},
	{
		id: "2",
		name: "XYZ Auto",
		contactPerson: "Jane Smith",
		email: "jane@xyzauto.com",
		phone: "+1987654321",
		address: "456 Oak Ave, Othertown, USA",
	},
];

export function SalesModule() {
	const [sales, setSales] = React.useState<Sale[]>([]);
	const [showAddForm, setShowAddForm] = React.useState(false);
	const [editingSale, setEditingSale] = React.useState<Sale | null>(null);
	const [fetchedSales, setFetchedSales] = React.useState<Sale[]>([]);

	const { data: companies } = useSWR("/companies", fetcher);

	const {
		data: carList,
		error: carListError,
		isLoading: carListLoading,
	} = useSWR(`${BASE_URL}/cars`, fetcher);

	console.log(fetchedSales, "sales data");

	const handleAddSale = async (newSale: any) => {
		try {
			const response = await addSale({ url: "sale", sale: newSale });

			if (response.data) {
				toast.success("New sale has been successfully added");
			}
			mutate(`${BASE_URL}/sales`);
		} catch (error) {
			toast.error("Error Fetching sales");
		}

		// const sale: Sale = {
		// 	...newSale,
		// 	id: sales.length + 1,
		// 	car: mockCars.find(
		// 		(car) => car.car_uuid === newSale.carId.toString()
		// 	) as Car,
		// 	company: mockCompanies.find(
		// 		(company) => Number(company.id) === newSale.companyId
		// 	) as Company,
		// 	installments:
		// 		newSale.installments?.map((installment, index) => ({
		// 			id: index + 1,
		// 			amount: installment.amount,
		// 			dueDate: format(installment.dueDate, "yyyy-MM-dd"),
		// 			paid: false,
		// 		})) || [],
		// 	createdAt: new Date().toISOString(),
		// 	updatedAt: new Date().toISOString(),
		// };
		// setSales([...sales, sale]);
		// setShowAddForm(false);
	};

	const handleEditSale = (updatedSale: Sale) => {
		setSales(
			sales.map((sale) =>
				sale.id === updatedSale.id ? updatedSale : sale
			)
		);
		setEditingSale(null);
		toast.success("New sale has been successfully updated");
	};

	const handleInlineEdit = (updatedSale: Sale) => {
		setSales(
			sales.map((sale) =>
				sale.id === updatedSale.id ? updatedSale : sale
			)
		);
		toast.success("Sale has been successfully updated.");
	};

	const handleInstallmentPayment = (
		saleId: number,
		installmentId: number
	) => {
		setSales(
			sales.map((sale) => {
				if (sale.id === saleId) {
					return {
						...sale,
						installments: sale.installments.map(
							(installment) =>
								installment.id === installmentId
									? { ...installment, paid: true }
									: installment
						),
					};
				}
				return sale;
			})
		);
		toast.success("Installment has been marked as paid.");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF();
		doc.text("Sales Report", 14, 15);
		const tableColumn = [
			"ID",
			"Total Price",
			"Sale Date",
			"Car",
			"Company",
			"Payment Type",
		];
		const tableRows = fetchedSales?.map((sale: any) => [
			sale.ID,
			`$${sale.total_price.toFixed(2)}`,
			format(new Date(sale.sale_date), "PPP"),
			`${sale.Car.make} ${sale.car.car_model}`,
			sale.Company.name,
			sale.is_full_payment ? "Full Payment" : "Installments",
		]);
		console.log("sale rows ", fetchedSales);

		// @ts-ignore
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
		});

		doc.save(`sales_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
		toast.success("Sales report has been downloaded as PDF.");
	};

	const handleDownloadExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			sales.map((sale) => ({
				ID: sale.id,
				"Total Price": sale.totalPrice,
				"Sale Date": format(new Date(sale.saleDate), "PPP"),
				Car: `${sale.car.make} ${sale.car.car_model}`,
				Company: sale.company.name,
				"Payment Type": sale.isFullPayment
					? "Full Payment"
					: "Installments",
			}))
		);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
		XLSX.writeFile(
			workbook,
			`sales_report_${format(new Date(), "yyyy-MM-dd")}.xlsx`
		);
		toast.success("Sales report has been downloaded as Excel file.");
	};

	const {
		data: salesList,
		error: salesListError,
		isLoading: salesListLoading,
	} = useSWR(`${BASE_URL}/sales`, fetcher);

	React.useEffect(() => {
		if (salesList?.data) {
			const flattenedList = salesList.data.map(
				(item: any) => item.sale
			);
			setFetchedSales(flattenedList);
		}
	}, [salesList]);

	// console.log("fetched sales ===", fetchedSales);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sales Management</CardTitle>
				<CardDescription>
					Manage and track your car sales, view analytics, and
					generate reports.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs
					defaultValue="overview"
					className="space-y-4"
				>
					<TabsList>
						<TabsTrigger value="overview">
							Overview
						</TabsTrigger>
						<TabsTrigger value="sales">Sales</TabsTrigger>
						<TabsTrigger value="analytics">
							Analytics
						</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<div className="space-y-4">
							<Button onClick={() => setShowAddForm(true)}>
								<Plus className="mr-2 h-4 w-4" /> Add
								Sale
							</Button>
							{showAddForm && (
								<Card>
									<CardHeader>
										<CardTitle>
											Add New Sale
										</CardTitle>
									</CardHeader>
									<CardContent>
										<SaleForm
											onSubmit={handleAddSale}
											companies={
												companies?.data
											}
										/>
									</CardContent>
								</Card>
							)}
							{editingSale && (
								<Card>
									<CardHeader>
										<CardTitle>
											Edit Sale
										</CardTitle>
									</CardHeader>
									<CardContent>
										<EditSaleForm
											sale={editingSale}
											onSubmit={handleEditSale}
											cars={carList?.data}
											companies={mockCompanies}
											onCancel={() =>
												setEditingSale(null)
											}
										/>
									</CardContent>
								</Card>
							)}
							<SalesVisualization sales={sales} />
						</div>
					</TabsContent>
					<TabsContent value="sales">
						<SalesTable
							data={fetchedSales}
							onInstallmentPayment={
								handleInstallmentPayment
							}
							onEditSale={setEditingSale}
							onInlineEdit={handleInlineEdit}
							onDownloadPDF={handleDownloadPDF}
							onDownloadExcel={handleDownloadExcel}
						/>
					</TabsContent>
					<TabsContent value="analytics">
						<SalesVisualization sales={sales} />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
