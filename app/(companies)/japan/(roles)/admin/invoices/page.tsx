"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import useSWR from "swr";
import { fetcher } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import { handleDownloadExcel as downloadExcel } from "@/lib/utils";

export default function InvoicesPage() {
	const { data: invoicesData, isLoading } = useSWR(
		`${BASE_URL}/shipping/invoices`,
		fetcher
	);

	const handleDownloadPDF = () => {
		// Implement PDF download logic
		console.log("Downloading PDF...");
	};

	const handleDownloadExcel = () => {
		if (invoicesData?.data) {
			downloadExcel(invoicesData.data, "Invoices");
		}
	};

	return (
		<div className="container mx-auto py-10">
			<Tabs defaultValue="list">
				<TabsList>
					<TabsTrigger value="list">Invoice List</TabsTrigger>
					<TabsTrigger value="create">
						Create Invoice
					</TabsTrigger>
				</TabsList>
				<TabsContent value="list">
					<InvoiceTable
						data={invoicesData?.data || []}
						onDownloadPDF={handleDownloadPDF}
						onDownloadExcel={handleDownloadExcel}
					/>
				</TabsContent>
				<TabsContent value="create">
					<InvoiceForm />
				</TabsContent>
			</Tabs>
		</div>
	);
}
