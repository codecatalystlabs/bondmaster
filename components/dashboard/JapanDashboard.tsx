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





const topDeals = [
	{
		name: "Michael Jordan",
		email: "michael.jordan@example.com",
		amount: "$2,893",
	},
	{
		name: "Emigo Kiaren",
		email: "emigo.kiaren@gmail.com",
		amount: "$4,289",
	},
	{
		name: "Randy Origoan",
		email: "randy.origoan@gmail.com",
		amount: "$6,347",
	},
	{
		name: "George Pieterson",
		email: "george.pieterson@gmail.com",
		amount: "$3,894",
	},
	{
		name: "Kiara Advain",
		email: "kiaraadvain214@gmail.com",
		amount: "$2,679",
	},
];

export function JapanDashboard() {

    const { data, error, isLoading } = useSWR('/cars', fetcher)
    console.log(data,"data")

    const stats = [
		{
			title: "Total Cars",
			value: data?.data?.length,
			change: "100%",
			icon: <TeamOutlined />,
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
			value: "$56,562",
			change: "+25%",
			icon: <DollarOutlined />,
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
			title: "Conversion Ratio",
			value: "12.08%",
			change: "-12%",
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
		{
			title: "Total Deals",
			value: "2,543",
			change: "+19%",
			icon: <FileTextOutlined />,
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
							Your Progress Overview
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

					<div className="mt-2">
						<div className="flex justify-between items-center mb-1">
							<span className="text-sm font-medium text-primary-foreground/80">
								Target Progress
							</span>
							<span className="text-sm font-medium text-primary-foreground/80">
								48%
							</span>
						</div>
						<div className="w-full bg-gray-700 rounded-full h-2.5">
							<div
								className="bg-green-600 h-2.5 rounded-full"
								style={{ width: "48%" }}
							></div>
						</div>
					</div>
					<p className="mt-2 text-primary-foreground/80">
						You have completed 48% of your target. Keep up the
						good work!
					</p>
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
										{stat?.title}
									</p>
									<h3 className="mt-1 text-2xl font-semibold">
										{stat?.value}
									</h3>
									<p
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
									</p>
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

				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="col-span-2 p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Revenue Analytics
							</h3>
							<Button
								variant="outline"
								size="sm"
							>
								View All
							</Button>
						</div>
						<div className="mt-4 h-[300px]">
							{/* <LineChart
								data={[
									65, 59, 80, 81, 56, 55, 40, 65, 59,
									80, 81, 56,
								]}
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
									"Oct",
									"Nov",
									"Dec",
								]}
								index="0"
							/> */}
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Leads By Source
							</h3>
							<Button
								variant="outline"
								size="sm"
							>
								View All
							</Button>
						</div>
						<div className="mt-4 h-[300px]">
							{/* <DoughnutChart
								data={[1624, 1267, 1153, 679]}
								labels={[
									"Mobile",
									"Desktop",
									"Laptop",
									"Tablet",
								]}
							/> */}
						</div>
					</Card>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Top Deals
							</h3>
							<Button
								variant="outline"
								size="sm"
							>
								View All
							</Button>
						</div>
						<div className="mt-4 space-y-4">
							{topDeals?.map((deal, i) => (
								<div
									key={i}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 rounded-full bg-gray-200" />
										<div>
											<div className="font-medium">
												{deal?.name}
											</div>
											<div className="text-sm text-gray-500">
												{deal?.email}
											</div>
										</div>
									</div>
									<div className="font-medium">
										{deal?.amount}
									</div>
								</div>
							))}
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Deals Status
							</h3>
							<Button
								variant="outline"
								size="sm"
							>
								View All
							</Button>
						</div>
						<div className="mt-4 space-y-4">
							<div className="flex items-center justify-between">
								<div>Successful Deals</div>
								<div className="font-medium">
									987 deals
								</div>
							</div>
							<Progress value={70} />
							<div className="flex items-center justify-between">
								<div>Pending Deals</div>
								<div className="font-medium">
									1,073 deals
								</div>
							</div>
							<Progress value={45} />
							<div className="flex items-center justify-between">
								<div>Rejected Deals</div>
								<div className="font-medium">
									1,674 deals
								</div>
							</div>
							<Progress value={25} />
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
