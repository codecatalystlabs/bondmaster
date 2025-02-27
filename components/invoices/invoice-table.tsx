"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InvoicePreviewDialog } from "./invoice-preview-dialog";
import useSWR from "swr";
import { BASE_URL } from "@/constants/baseUrl";
import { fetcher } from "@/apis";

interface Car {
	ID: number;
	car_uuid: string;
	chasis_number: string;
	engine_number: string;
	engine_capacity: string;
	make: string;
	car_model: string;
	manufacture_year: number;
	colour: string;
	bid_price: number;
	vat_tax: number;
	currency: string;
	purchase_date?: string;
}

interface InvoiceDetails {
	ID: number;
	invoice_no: string;
	ship_date: string;
	vessel_name: string;
	from_location: string;
	to_location: string;
	created_by: string;
	updated_by: string;
	CreatedAt: string;
}

interface Invoice {
	cars: Car[];
	invoice: InvoiceDetails;
}

interface InvoiceTableProps {
	data: Invoice[];
	onDownloadPDF: () => void;
	onDownloadExcel: () => void;
}

export function InvoiceTable({ data, onDownloadPDF, onDownloadExcel }: InvoiceTableProps) {
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

	return (
		<>
			<Table>
				<TableCaption>A list of your recent invoices</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Invoice No</TableHead>
						<TableHead>Ship Date</TableHead>
						
						<TableHead>Vessel Name</TableHead>
						<TableHead>From</TableHead>
						<TableHead>To</TableHead>
						<TableHead>Created By</TableHead>
						<TableHead>Updated By</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data?.map((invoice: any) => (
						<TableRow key={invoice?.invoice?.invoice_no}>
							<TableCell>
								{invoice?.invoice?.invoice_no}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.ship_date}
							</TableCell>
							
							<TableCell>
								{invoice?.invoice?.vessel_name}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.from_location}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.to_location}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.created_by}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.updated_by}
							</TableCell>
							<TableCell>
								<Button
									onClick={() =>
									
									{
										console.log(invoice,"invoice");
										setSelectedInvoice(
											 invoice
										);
									}
									}
								>
									Preview
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{selectedInvoice && (
				<InvoicePreviewDialog
					invoice={selectedInvoice}
					open={!!selectedInvoice}
					onOpenChange={() => setSelectedInvoice(null)}
				/>
			)}
		</>
	);
}
