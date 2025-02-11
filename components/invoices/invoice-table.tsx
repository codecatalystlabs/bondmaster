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

interface Invoice {
	invoice_no: string;
	ship_date: string;
	currency: string;
	total_cost: number;
	vessel_name: string;
	from_location: string;
	to_location: string;
	created_by: string;
	updated_by: string;
}



export function InvoiceTable() {
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
		null
	);

	const { data: invoicesData, isLoading } = useSWR(
		`${BASE_URL}/shipping/invoices`,fetcher
	);

	// console.log(invoicesData?.data,"pppads")

	return (
		<>
			<Table>
				<TableCaption>A list of your recent invoices</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Invoice No</TableHead>
						<TableHead>Ship Date</TableHead>
						<TableHead>Currency</TableHead>
						<TableHead>Total Cost</TableHead>
						<TableHead>Vessel Name</TableHead>
						<TableHead>From</TableHead>
						<TableHead>To</TableHead>
						<TableHead>Created By</TableHead>
						<TableHead>Updated By</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invoicesData?.data?.map((invoice: any) => (
						<TableRow key={invoice?.invoice?.invoice_no}>
							<TableCell>
								{invoice?.invoice?.invoice_no}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.ship_date}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.currency}
							</TableCell>
							<TableCell>
								{invoice?.invoice?.total_cost?.toLocaleString()}
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
