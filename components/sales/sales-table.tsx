"use client";

import * as React from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
	Edit2,
	Save,
	X,
	FileText,
	FileSpreadsheet,
	Trash2,
} from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sale } from "@/types/sale";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetcher, updateSale } from "@/apis";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { BASE_URL } from "@/constants/baseUrl";
import InvoiceDialog from "./InvoiceModal";
import PaymentDialog from "./PaymentModal";
import {  Tabs, TabsContent, TabsList, TabsTrigger  } from "../ui/tabs";
import { InvoiceTable } from "./InvoiceTable";
import { PaymentsTable } from "./Payments";
import { PaymentDepositsTable } from "./DepositTable";

interface SalesTableProps {
	data: Sale[];
	onInstallmentPayment: (saleId: number, installmentId: number) => void;
	onEditSale: (sale: Sale) => void;
	onInlineEdit: (updatedSale: Sale) => void;
	onDownloadPDF: () => void;
	onDownloadExcel: () => void;
	onDeleteSale: (id: string) => void;
}

export function SalesTable({
	data,
	onInstallmentPayment,
	onEditSale,
	onInlineEdit,
	onDownloadPDF,
	onDownloadExcel,
	onDeleteSale,
}: SalesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [editingRow, setEditingRow] = React.useState<number | null>(null);
	const [selectedSale, setSelectedSale] = React.useState<any>(null);
	const [isDialogOpen, setDialogOpen] = React.useState(false);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = React.useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = React.useState(false);
	const [openSaleDetails, setOpenSaleDetails] = React.useState(false);

	const openEditDialog = (sale: Sale) => {
		setSelectedSale(sale);
		setDialogOpen(true);
	};

	const openInvoiceDialog = (sale: Sale) => {
		setSelectedSale(sale);
		setInvoiceDialogOpen(true);
	};

	const paymentDialog=(sale:Sale)=>{
		setSelectedSale(sale);
		setOpenPaymentDialog(true);
	}
   const detailsDialog = (sale:Sale)=>{
	   setSelectedSale(sale);
	   setOpenSaleDetails(true)

   }
	const closeEditDialog = () => {
		setDialogOpen(false);
		setSelectedSale(null);
	};


	const { data: invoicesData } = useSWR("/invoices", fetcher);
	const { data: paymentsData } = useSWR("/payments", fetcher);
	const { data: depositsData } = useSWR("/deposits", fetcher);
    const deposits = depositsData?.data.filter((deposit:any) => deposit?.sale_payment_id === selectedSale?.ID) || [];
	const payments = paymentsData?.data.filter((payment:any) => payment?.sale_payment_id === selectedSale?.ID) || [];
	 const invoices = invoicesData?.data.filter((invoice:any) => invoice?.sale_id === selectedSale?.ID) || [];

    console.log(invoicesData,"AM THE Invoices")
	console.log(selectedSale,"AM THE SALE")

	const columns: ColumnDef<Sale>[] = [
		{
			accessorKey: "ID",
			header: "ID",
		},
		{
			accessorKey: "total_price",
			header: "Total Price",
			cell: ({ row }: any) => {
				const isEditing = editingRow === row.original.ID;
				const amount = parseFloat(row.getValue("total_price"));
				const formatted = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				}).format(amount);

				return isEditing ? (
					<Input
						type="number"
						defaultValue={amount}
						onChange={(e) => {
							const updatedSale = {
								...row.original,
								total_price: parseFloat(e.target.value),
							};
							onInlineEdit(updatedSale);
						}}
					/>
				) : (
					<div className="font-medium">{formatted}</div>
				);
			},
		},
		{
			accessorKey: "sale_date",
			header: "Sale Date",
			cell: ({ row }) =>
				new Date(row.getValue("sale_date")).toLocaleDateString(),
		},
		{
			accessorKey: "Car.make",
			header: "Car Make",
		},
		{
			accessorKey: "Car.car_model",
			header: "Car Model",
		},
		// {
		// 	accessorKey: "Company.name",
		// 	header: "Company",
		// },
		{
			accessorKey: "is_full_payment",
			header: "Payment Type",
			cell: ({ row }: any) => {
				const isEditing = editingRow === row.original.ID;
				const is_full_payment = row.getValue(
					"is_full_payment"
				) as boolean;

				return isEditing ? (
					<Select
						defaultValue={
							is_full_payment ? "full" : "installments"
						}
						onValueChange={(value) => {
							const updatedSale = {
								...row.original,
								is_full_payment: value === "full",
							};
							onInlineEdit(updatedSale);
						}}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="full">
								Full Payment
							</SelectItem>
							<SelectItem value="installments">
								Installments
							</SelectItem>
						</SelectContent>
					</Select>
				) : is_full_payment ? (
					"Full Payment"
				) : (
					"Installments"
				);
			},
		},
		{
			accessorKey: "payment_period",
			header: "Payment Period",
		},
		{
			id: "actions",
			cell: ({ row }: any) => (
				<div className="flex space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => openEditDialog(row.original)}
					>
						<Edit2 className="h-4 w-4" />
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => onDeleteSale(row?.original?.ID)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
					<Button
						size="sm"
						onClick={() => openInvoiceDialog(row.original)}
					>
						Add Invoice
					</Button>
					<Button
						size="sm"
						onClick={() => paymentDialog(row.original)}
					>
						Add Payment
					</Button>
					<Button
						size="sm"
						onClick={() => detailsDialog(row.original)}					>
						View Details
					</Button>
				</div>
			),
		},
	];

	const handleSaleUpdate = async () => {
		try {
			console.log(selectedSale, "ajkaajaj");
			const response = await updateSale({
				url: `sale/${selectedSale?.ID}`,
				sale: selectedSale,
			});

			if (response.data) {
				closeEditDialog();
				toast.success("New sale has been successfully added");
			}
			mutate(`${BASE_URL}/sales`);
		} catch (error) {
			toast.error("Error Fetching sales");
		}
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div>
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Filter by company..."
					onChange={(event) =>
						table
							.getColumn("Company.name")
							?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>

				<div className="flex space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={onDownloadPDF}
					>
						<FileText className="mr-2 h-4 w-4" />
						Download PDF
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onDownloadExcel}
					>
						<FileSpreadsheet className="mr-2 h-4 w-4" />
						Download Excel
					</Button>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header
															.column
															.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() &&
										"selected"
									}
								>
									{row
										.getVisibleCells()
										.map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column
														.columnDef
														.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
			<Dialog
				open={isDialogOpen}
				onOpenChange={setDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Sale</DialogTitle>
					</DialogHeader>
					{selectedSale && (
						<div className="space-y-4">
							<div className="mt-2">
								<label>Total Price</label>
								<Input
									defaultValue={
										selectedSale.total_price
									}
									onChange={(e) =>
										setSelectedSale({
											...selectedSale,
											total_price: parseFloat(
												e.target.value
											),
										})
									}
								/>
							</div>

							<div className="mt-2">
								<label>Sale Date</label>
								<Input
									type="date"
									defaultValue={
										selectedSale.sale_date
									}
									onChange={(e) =>
										setSelectedSale({
											...selectedSale,
											sale_date:
												e.target.value,
										})
									}
								/>
							</div>
							<div className="mt-2">
								<label>Make</label>
								<Input
									defaultValue={
										selectedSale?.Car.make
									}
									disabled
								/>
							</div>
							<div className="mt-2">
								<label>Model</label>
								<Input
									defaultValue={
										selectedSale.Car.model
									}
									disabled
								/>
							</div>

							<div className="mt-2">
								<label>Payment Type</label>
								<Select
									value={
										selectedSale.is_full_payment
											? "true"
											: "false"
									} // Convert boolean to string for Select
									onValueChange={(value) =>
										setSelectedSale({
											...selectedSale,
											is_full_payment:
												value === "true", // Convert string back to boolean
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select option">
											{selectedSale.is_full_payment
												? "Full Payment"
												: "Installments"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">
											Full Payment
										</SelectItem>
										<SelectItem value="false">
											Installments
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="mt-2">
								<label>Payment Periods</label>
								<Input
									defaultValue={
										selectedSale.payment_period
									}
									onChange={(e) =>
										setSelectedSale({
											...selectedSale,
											payment_period: parseInt(
												e.target.value,
												10
											),
										})
									}
								/>
							</div>

							<Button onClick={handleSaleUpdate}>
								Save
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
			<Dialog open={openSaleDetails} onOpenChange={setOpenSaleDetails}>
			<DialogContent className="sm:max-w-[700px]">
			<DialogHeader>
					<DialogTitle className="text-2xl">
                       Sale Details
					</DialogTitle>
				</DialogHeader>

    <Tabs defaultValue="invoices" 					
	className="w-full"
	>
		<TabsList className="grid w-full grid-cols-5">
		<TabsTrigger  value="invoices">
          Invoices
        </TabsTrigger>
        <TabsTrigger value="payments">
          Payments Mode
        </TabsTrigger>

		<TabsTrigger value="deposits">
          Payments Deposits
        </TabsTrigger>
      </TabsList>

      <TabsContent className="p-4 bg-gray-50 rounded-lg" value="invoices">
        <InvoiceTable data={invoices} />
      </TabsContent>

      <TabsContent className="p-4 bg-gray-50 rounded-lg" value="payments">
        <PaymentsTable data={payments} />
      </TabsContent>
	  <TabsContent className="p-4 bg-gray-50 rounded-lg" value="deposits">
        <PaymentDepositsTable data={deposits} />
      </TabsContent>
    </Tabs>

    <div className="flex justify-end mt-4">
      <Button variant="secondary" className="px-4 py-2" onClick={() => setOpenSaleDetails(false)}>
        Close
      </Button>
    </div>
  </DialogContent>
</Dialog>


			<InvoiceDialog
				open={invoiceDialogOpen}
				onOpenChange={setInvoiceDialogOpen}
				selectedSale={selectedSale}
			/>
			<PaymentDialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}  selectedSale={selectedSale} />
			
		</div>
	);
}
