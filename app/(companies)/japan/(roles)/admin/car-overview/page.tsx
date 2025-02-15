"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarInventory } from "@/components/cars/car-inventory";
import InvoicesPage from "../invoices/page";
import CarExpensesPage from "../single-car-expense/page";


export default function CarOverview() {
	return (
		<Tabs
			defaultValue="inventory"
			className="w-full"
		>
			<TabsList className="flex justify-start space-x-4 w-[40%]">
				<TabsTrigger value="inventory">Car Inventory</TabsTrigger>
				<TabsTrigger value="invoices">Invoices</TabsTrigger>
				<TabsTrigger value="car_expenses">Car Expenses</TabsTrigger>
			</TabsList>
			<TabsContent value="inventory">
				<CarInventory />
			</TabsContent>
			<TabsContent value="invoices">
				<InvoicesPage />
			</TabsContent>
			<TabsContent value="car_expenses">
				<CarExpensesPage />
			</TabsContent>
		</Tabs>
	);
}
