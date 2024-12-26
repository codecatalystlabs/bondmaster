"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { SnackbarProvider } from "notistack";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Car Inventory",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SnackbarProvider
					maxSnack={3}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					preventDuplicate
				>
					<div className="flex h-screen">
						<Sidebar />
						<div className="flex flex-1 flex-col">
							<Header />
							{children}
						</div>
					</div>
				</SnackbarProvider>
			</body>
		</html>
	);
}
