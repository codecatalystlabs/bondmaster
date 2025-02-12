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
import { Edit2, Save, X, FileText, FileSpreadsheet } from "lucide-react";

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

interface SalesTableProps {
	data: Sale[];
	onInstallmentPayment: (saleId: number, installmentId: number) => void;
	onEditSale: (sale: Sale) => void;
	onInlineEdit: (updatedSale: Sale) => void;
	onDownloadPDF: () => void;
	onDownloadExcel: () => void;
}

export function SalesTable({
	data,
	onInstallmentPayment,
	onEditSale,
	onInlineEdit,
	onDownloadPDF,
	onDownloadExcel,
}: SalesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [editingRow, setEditingRow] = React.useState<number | null>(null);

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
			accessorKey: "car.car_model",
			header: "Car Model",
		},
		{
			accessorKey: "Company.name",
			header: "Company",
		},
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
			cell: ({ row }: any) => {
				const isEditing = editingRow === row.original.ID;
				const payment_period = row.getValue(
					"payment_period"
				) as number;

				return isEditing ? (
					<Input
						type="number"
						defaultValue={payment_period}
						onChange={(e) => {
							const updatedSale = {
								...row.original,
								payment_period: parseInt(
									e.target.value
								),
							};
							onInlineEdit(updatedSale);
						}}
					/>
				) : (
					`${payment_period} months`
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }: any) => {
				const isEditing = editingRow === row.original.ID;

				return isEditing ? (
					<div className="flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setEditingRow(null)}
						>
							<Save className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setEditingRow(null)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				) : (
					<div className="flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setEditingRow(row.original.ID)
							}
						>
							<Edit2 className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onEditSale(row.original)}
						>
							Edit
						</Button>
					</div>
				);
			},
		},
	];

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
					value={
						(table
							.getColumn("company.name")
							?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn("company.name")
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
	);
}
