"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "react-hot-toast";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar-uganda";
import { useRouter } from "next/navigation";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});



export default function UgandaLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();


	const userData = JSON.parse(localStorage.getItem("user-details") || "{}");
	if (!userData?.state?.user) {
	 router.push("/signin"); // Redirect to signin if no user found
  } 
 


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
