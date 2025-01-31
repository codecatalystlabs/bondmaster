"use client";
import useUserStore from "@/app/store/userStore";
import { DashboardMain } from "@/components/dashboard/main";
import React, { useState } from "react";


export default function AdminDashboardPage() {
	const user = useUserStore((state) => state.user);
	console.log(user)


	return <DashboardMain/>

}
