"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, DoughnutChart } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
	TeamOutlined,
	DollarOutlined,
	SwapOutlined,
	FileTextOutlined,
} from "@ant-design/icons";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { fetcher } from "@/apis";
import { Car, JapaneseYen } from "lucide-react";
import { BASE_URL } from "@/constants/baseUrl";



export function JapanDashboard() {

    const { data, error, isLoading } = useSWR(`${BASE_URL}/cars`, fetcher)
	
	const totalCarExpenditure = data?.data?.reduce((sum: any, item: any) => sum + item?.car.bid_price, 0)

    const stats = [
		{
			title: "Total Cars Purchased",
			value: data?.data?.length || 0,
			change: "100%",
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
			title: "Total Car Expenditure",
			value: isLoading ? "loading" : totalCarExpenditure || 0,

			icon: <JapaneseYen />,
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
			title: "Total Cars Dispatched",
			value: data?.data?.length || 0,

			icon: <SwapOutlined />,
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
							Japan Dashboard Overview
						</h3>
						<span className="text-sm text-primary-foreground/80">
							{new Date().toLocaleString("ja-JP", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
								timeZone: "Asia/Tokyo",
							})}
						</span>
					</div>
				</Card>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{stats?.map((stat, i) => (
						<Card
							key={i}
							className="p-6"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500">
										{stat?.title}
									</p>
									<h3 className="mt-1 text-2xl font-semibold">
										{stat?.value}
									</h3>
									{/* <p
										className={cn(
											"mt-1 text-sm",
											stat.change.startsWith(
												"+"
											)
												? "text-green-500"
												: "text-red-500"
										)}
									>
										{stat?.change} this month
									</p> */}
								</div>
								<div className="text-2xl text-gray-400">
									{stat?.icon}
								</div>
							</div>
							<div className="mt-4 h-16">
								{stat?.chart}
							</div>
						</Card>
					))}
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Visualization by cars
							</h3>
							<Button
								variant="outline"
								size="sm"
							>
								View All
							</Button>
						</div>
						<div className="mt-4 h-[300px]">
							<DoughnutChart
								data={[data?.data?.length, 1000]}
								labels={[
									"Total Car Stock Available",
									"Total Cars Sold",
								]}
							/>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
