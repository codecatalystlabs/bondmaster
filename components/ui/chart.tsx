"use client";

import * as React from "react";
import {
	Line,
	LineChart as RechartsLineChart,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
} from "recharts";
import { Cell, Pie, PieChart } from "recharts";

import { cn } from "@/lib/utils";

export function ChartTooltip({
	active,
	payload,
	label,
}: TooltipProps<any, any>) {
	if (!active || !payload) {
		return null;
	}

	return (
		<div className="rounded-lg border bg-background p-2 shadow-sm">
			<div className="grid grid-cols-2 gap-2">
				{payload.map((data: any, i: number) => (
					<div
						key={i}
						className="flex flex-col"
					>
						<span className="text-[0.70rem] uppercase text-muted-foreground">
							{data.name}
						</span>
						<span className="font-bold text-muted-foreground">
							{data.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
//   data: number[]
//   labels?: string[]
//   colors?: string[]
// }

interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
	data: { [key: string]: any }[];

	categories: string[];

	index: string;

	colors?: string[];
	labels?: string;
	valueFormatter?: (value: any) => string;
}

export function LineChart({
	data,
	labels,
	colors = ["hsl(var(--primary))"],
	className,
	...props
}: LineChartProps) {
	const chartData = data.map((value, i) => ({
		value,
		label: labels?.[i] || `Point ${i + 1}`,
	}));

	return (
		<div
			className={cn("h-full w-full", className)}
			{...props}
		>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<RechartsLineChart data={chartData}>
					<Tooltip content={<ChartTooltip />} />
					<Line
						type="monotone"
						dataKey="value"
						stroke={colors[0]}
						strokeWidth={2}
						dot={false}
					/>
				</RechartsLineChart>
			</ResponsiveContainer>
		</div>
	);
}

interface DoughnutChartProps extends React.HTMLAttributes<HTMLDivElement> {
	data: number[];
	labels: string[];
	colors?: string[];
}

export function DoughnutChart({
	data,
	labels,
	colors = [
		"hsl(var(--primary))",
		"hsl(var(--secondary))",
		"hsl(var(--accent))",
		"hsl(var(--muted))",
	],
	className,
	...props
}: DoughnutChartProps) {
	const chartData = data.map((value, i) => ({
		value,
		label: labels[i],
	}));

	return (
		<div
			className={cn("h-full w-full", className)}
			{...props}
		>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<PieChart>
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="label"
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={80}
					>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={colors[index % colors.length]}
							/>
						))}
					</Pie>
					<Tooltip content={<ChartTooltip />} />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
