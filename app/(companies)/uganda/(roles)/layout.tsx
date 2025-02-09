"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "react-hot-toast";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar-uganda";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

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
	const [userData, setUserData] = useState<any>(null);
	const [isClient,setIsClient] = useState(false)


	useEffect(() => {
		  setIsClient(true);
			if (typeof window !== "undefined") {
				const storedUserData = JSON.parse(
					localStorage.getItem("user-details") || "{}"
				);
				setUserData(storedUserData);
				if (!storedUserData?.state?.user) {
					router.push("/signin");
				}
			}
	   }, []);
	
	   if(!isClient) return <Loader />


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
