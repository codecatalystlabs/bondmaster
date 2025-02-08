"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "react-hot-toast";
import { AdminJapanSidebar } from "@/components/dashboard/admin-sidebar-japan";
import useUserStore from "@/app/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
}: Readonly<{ children: React.ReactNode }>) {
   const router = useRouter();


   const userData = JSON.parse(localStorage.getItem("user-details") || "{}");
   if (!userData?.state?.user) {
	router.push("/signin"); // Redirect to signin if no user found
 } 


   return (
      <WithAuth>
         <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
