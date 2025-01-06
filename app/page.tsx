"use client";
import { SignIn } from "@/components/auth/signn-in";
import { DashboardMain } from "@/components/dashboard/main";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
	// const [token, setToken] = useState(false);
	// return token ? <DashboardMain /> : redirect("/signin");
	return <DashboardMain />;
}
