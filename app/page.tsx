"use client";
import { DashboardMain } from "@/components/dashboard/main";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import { parseCookies } from "nookies";

export default function DashboardPage() {
	const cookies = parseCookies();
	const token = cookies.token

	return redirect("/signin");

}
