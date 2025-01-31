import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "react-hot-toast";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar-uganda";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Car Inventory | Uganda",
  description: "Manage and track car inventory efficiently in Uganda. Powered by CodeCatalystLabsUg.",
};

export default function UgandaLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
			<div
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Toaster />
				<div className="flex h-screen">
					<AdminSidebar />
					<div className="flex flex-1 flex-col">
						<Header />
						{children}
					</div>
				</div>
			</div>
	);
}
