"use client";
import { DashboardMain } from "@/components/dashboard/main";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

export default function DashboardPage() {
   const router = useRouter();
   const cookies = parseCookies();
   const token = cookies.token;

   const [user, setUser] = useState(null);

   useEffect(() => {
      if (typeof window !== "undefined") {
         const userData = JSON.parse(localStorage.getItem("user-details") || "{}");

         if (!userData?.state?.user || !token) {
            router.push("/signin"); // Redirect if no user data or no token
         } else {
            setUser(userData.state.user);
         }
      }
   }, [token]);

   if (!user) {
      return <p>Loading...</p>; // Prevents flickering while checking auth
   }

   return <DashboardMain />;
}
