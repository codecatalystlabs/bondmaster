"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "react-hot-toast";
import { AdminJapanSidebar } from "@/components/dashboard/admin-sidebar-japan";
import useUserStore from "@/app/store/userStore";
import { redirect } from "next/navigation";
import WithAuth from "@/app/hooks/withAuth";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});



export default function JapanLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = useUserStore((state) => state.user)
	  console.log(user,"user in the higher order component")
	if(!user)redirect('/signin')
	return (

		<WithAuth>
		<div
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
			<Toaster />
			<div className="flex h-screen">
				<AdminJapanSidebar />
				<div className="flex flex-1 flex-col">
					<Header />
					{children}
				</div>
			</div>
			</div>
		
		</WithAuth>
	);
}
