"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarInventory } from "@/components/cars/car-inventory";
import InvoicesPage from "../invoices/page";


export default function CarOverview() {
	return (
		<Tabs
			defaultValue="inventory"
			className="w-full"
		>
			<TabsList className="flex space-x-4 w-[20%]">
				<TabsTrigger value="inventory">Car Inventory</TabsTrigger>
				<TabsTrigger value="invoices">Invoices</TabsTrigger>
			</TabsList>
			<TabsContent value="inventory">
				<CarInventory />
			</TabsContent>
			<TabsContent value="invoices">
				<InvoicesPage />
			</TabsContent>
		</Tabs>
	);
}
