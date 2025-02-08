"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { InvoiceTable } from "@/components/invoices/invoice-table";

export default function InvoicesPage() {
	const [activeTab, setActiveTab] = useState("list");

	return (
		<div className="container mx-auto py-10">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList>
					<TabsTrigger value="list">Invoice List</TabsTrigger>
					<TabsTrigger value="create">
						Create Invoice
					</TabsTrigger>
				</TabsList>
				<TabsContent value="list">
					<InvoiceTable />
				</TabsContent>
				<TabsContent value="create">
					<InvoiceForm />
				</TabsContent>
			</Tabs>
		</div>
	);
}
