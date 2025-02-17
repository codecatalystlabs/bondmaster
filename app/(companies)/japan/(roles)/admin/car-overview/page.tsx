"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarInventory } from "@/components/cars/car-inventory";
import InvoicesPage from "../invoices/page";
import CarExpensesPage from "../single-car-expense/page";
import CarSalePage from "../single-car-sale/page";
import useUserStore from "@/app/store/userStore";


export default function CarOverview() {
	const user = useUserStore((state) => state.user);
	return (
		<Tabs
			defaultValue="inventory"
			className="w-full"
		>
			<TabsList className="flex justify-start space-x-4 lg:w-[40%]">
				<TabsTrigger value="inventory">Car Inventory</TabsTrigger>
				{user?.group === "user" ? null : (
					<>
						<TabsTrigger value="invoices">
							Invoices
						</TabsTrigger>
						<TabsTrigger value="car_expenses">
							Car Expenses
						</TabsTrigger>
						<TabsTrigger value="car_sales">
							Car Sales
						</TabsTrigger>
					</>
				)}
			</TabsList>
			<TabsContent value="inventory">
				<CarInventory />
			</TabsContent>
			{user?.group === "user" ? null : (
				<>
					<TabsContent value="invoices">
						<InvoicesPage />
					</TabsContent>
					<TabsContent value="car_expenses">
						<CarExpensesPage />
					</TabsContent>
					<TabsContent value="car_sales">
						<CarSalePage />
					</TabsContent>
				</>
			)}
		</Tabs>
	);
}
