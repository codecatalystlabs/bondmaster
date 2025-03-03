"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, DoughnutChart } from "@/components/ui/chart";
import {
	Car,
	JapaneseYen,
	DollarSign,
	PackageOpen,
	Archive,
} from "lucide-react";
import { formatAmount } from "@/lib/utils";
import useSWR from "swr";
import { fetcher } from "@/apis";

export function UgandaDashboard() {

	const storedUserData = JSON.parse(
		localStorage.getItem("user-details") || "{}"
	);

	const companyId = storedUserData?.state?.user?.company_id;
	const { data: dashData, error, isLoading } = useSWR(`/car/dash/${companyId}`, fetcher);

	const stats = [
		{
			title: "Total Cars",
			value: dashData?.data?.total_cars || 0,
			icon: <Car />,
			chart: (
				<LineChart
					data={[30, 40, 35, 50, 49, 60, 70, 91, 125]}
					categories={[
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
					]}
					index="0"
				/>
			),
		},
		{
			title: "Cars in Stock",
			value: dashData?.data?.cars_in_stock || 0,
			icon: <PackageOpen />,
			chart: (
				<LineChart
					data={[65, 59, 80, 81, 56, 55, 40]}
					categories={[
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
					]}
					index="0"
				/>
			),
		},
		{
			title: "Disbanded Cars",
			value: dashData?.data?.disbanded_cars || 0,
			icon: <Archive />,
			chart: (
				<LineChart
					data={[10, 15, 8, 12, 9, 11, 13]}
					categories={[
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
					]}
					index="0"
				/>
			),
		},
		{
			title: "Total Expenses (USD)",
			value: formatAmount(
				dashData?.data?.total_car_expenses?.USD || 0,
				"$"
			),
			icon: <DollarSign />,
			chart: (
				<LineChart
					data={[65, 59, 80, 81, 56, 55, 40]}
					categories={[
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
					]}
					index="0"
				/>
			),
		},
	];

	return (
		<div className="flex-1 overflow-y-auto p-8">
			<div className="grid gap-6">
				<Card className="bg-primary p-6">
					<div className="flex justify-between items-center">
						<h3 className="text-xl font-semibold text-white">
							Uganda Dashboard Overview
						</h3>
						<span className="text-sm text-primary-foreground/80">
							{new Date().toLocaleString("en-UG", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
								timeZone: "Africa/Kampala",
							})}
						</span>
					</div>
				</Card>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat, i) => (
						<Card
							key={i}
							className="p-6"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500">
										{stat.title}
									</p>
									<h3 className="mt-1 text-2xl font-semibold">
										{stat.value}
									</h3>
								</div>
								<div className="text-2xl text-gray-400">
									{stat.icon}
								</div>
							</div>
							<div className="mt-4 h-16">{stat.chart}</div>
						</Card>
					))}
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Cars Overview
							</h3>
						</div>
						<div className="mt-4 h-[300px]">
							<DoughnutChart
								data={[
									dashData?.data?.cars_in_stock || 0,
									dashData?.data?.disbanded_cars ||
										0,
								]}
								labels={[
									"Cars in Stock",
									"Disbanded Cars",
								]}
							/>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
