"use client";

import { useState, JSX } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	AppstoreOutlined,
	FileTextOutlined,
	TeamOutlined,
	SettingOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserAddOutlined,
	CarOutlined,
	ShoppingOutlined,
	DollarOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { DollarSign, FileCheck, LogOut, Settings, Ship, ShoppingCart, UserCircle, Users } from "lucide-react";
import Image from "next/image";
import useUserStore from "@/app/store/userStore";

type MenuItem = {
	title: string;
	icon: JSX.Element;
	href?: string;
	badge?: string;
	onClick?: () => void;
};




export function AdminJapanSidebar() {
	const user = useUserStore((state) => state.user)
	const menuItems: { title: string; items: MenuItem[] }[] = [
		{
			title: "MAIN",
			items: [
				...(user?.group !== "user"
					? [
							{
								title: "Dashboards",
								icon: <AppstoreOutlined />,
								href: "/japan/admin/dashboard",
								badge: "12",
							},
					  ]
					: []),
				{
					title: "Car Inventory",
					icon: <CarOutlined />,
					href: "/japan/admin/car-inventory",
				},

				{
					title: "Cost Management",
					icon: <DollarOutlined />,
					href: "/japan/admin/cost-management",
				},

				{
					title: "Company Expenses",
					icon: <DollarSign size={16} />,
					href: "/japan/admin/expenses",
				},
				{
					title: "User Management",
					icon: <UserOutlined />,
					href: "/japan/admin/user-management",
				},
			],
		},
		{
			title: "SALE MANAGEMENT",
			items: [
				{
					title: "Sales",
					icon: <ShoppingCart size={16} />,
					href: "/sales",
					badge: "New",
				},
			],
		},
		{
			title: "ACCOUNT",
			items: [
				{
					title: "Profile",
					icon: <UserCircle size={16} />,
					href: "/japan/profile",
				},
				{
					title: "Sign Out",
					icon: <LogOut size={16} />,
					href: "",
					onClick: () => {
						useUserStore.getState().clearUser();
						useUserStore?.getState().clearToken();
						router.push("/signin");
					},
				},
			],
		},
	];
	

	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();

	const router = useRouter();

	return (
		<div
			className={cn(
				"flex flex-col h-screen bg-[#0B1727] text-white transition-all duration-300",
				collapsed ? "w-20" : "w-64"
			)}
		>
			<div className="flex h-20  items-center justify-between px-4 py-4 border-b border-gray-700">
				<div>
					<Image
						width={120}
						height={50}
						src="/logo.png"
						alt="logo"
						objectFit="cover"
					/>
				</div>
				<button
					onClick={() => setCollapsed(!collapsed)}
					className="text-gray-400 hover:text-white"
				>
					{collapsed ? (
						<MenuUnfoldOutlined />
					) : (
						<MenuFoldOutlined />
					)}
				</button>
			</div>

			<div className="flex-1 overflow-y-auto">
				{menuItems.map((section, i) => (
					<div
						key={i}
						className="px-4 py-4"
					>
						{!collapsed && (
							<h3 className="mb-2 text-xs font-semibold text-gray-400">
								{section.title}
							</h3>
						)}
						<ul className="space-y-1">
							{section.items.map((item, j) => (
								<li key={j}>
									<Link
									onClick={item.onClick}
										href={item.href ?? ""}
										className={cn(
											"flex items-center gap-x-3 rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white",
											pathname === item.href &&
												"bg-gray-800 text-white"
										)}
									>
										<span className="text-lg">
											{item.icon}
										</span>
										{!collapsed && (
											<>
												<span className="flex-1">
													{item.title}
												</span>
												{item.badge && (
													<span className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
														{
															item.badge
														}
													</span>
												)}
											</>
										)}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
