"use client";
import WithAuth from "@/app/hooks/withAuth";
import useUserStore from "@/app/store/userStore";
import { DashboardMain } from "@/components/dashboard/main";
import React, { useState } from "react";


export default function AdminDashboardPage() {
	


	return (
		<WithAuth>
			<DashboardMain />
		</WithAuth>
	); 

}
