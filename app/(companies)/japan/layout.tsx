"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "react-hot-toast";
import { AdminJapanSidebar } from "@/components/dashboard/admin-sidebar-japan";
import useUserStore from "@/app/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WithAuth from "@/app/hooks/withAuth";
import { Loader } from "@/components/ui/loader";

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
   const [userData, setUserData] = useState<any>(null);
   const [isClient, setIsClient] = useState(false);


  
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

   if(!isClient) return <Loader className="w-8 h-8" />

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
