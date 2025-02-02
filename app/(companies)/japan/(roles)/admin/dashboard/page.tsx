"use client";
import useUserStore from "@/app/store/userStore";
import { JapanDashboard } from "@/components/dashboard/JapanDashboard";
import React from "react";


export default function AdminDashboardPage() {
	const user = useUserStore((state) => state.user);
	console.log(user)


	return <JapanDashboard />;

}
