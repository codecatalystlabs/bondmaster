"use client";

import { useState } from "react";
import {
	Mail,
	Phone,
	MapPin,
	Briefcase,
	Calendar,
	Edit2,
	Building,
	CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import useUserStore from "@/app/store/userStore";

export function UserProfile() {

    const userStored:any = useUserStore((state) => state?.user);
    console.log(userStored);

	const [user, setUser] = useState({
		name: userStored?.username,
		email: userStored?.email,
		phone: "+1 (555) 123-4567",
		location: userStored?.location,
		position: userStored?.group,
		joinDate: "January 2020",
		profilePicture: "/placeholder.svg?height=200&width=200",
		company: "Global Auto Exports Inc.",
		department: "Sales and Logistics",
		employeeId: "EMP12345",
		expertise: ["Luxury Cars", "SUVs", "Electric Vehicles"],
	});

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-8">
				<Avatar className="w-24 h-24 sm:w-32 sm:h-32">
					<AvatarImage
						src={user?.profilePicture}
						alt={user?.name}
					/>
					<AvatarFallback>
						{(user?.name || "Unknown")
							.split(" ")
							.map((n:any) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
				<div className="text-center sm:text-left">
					<h2 className="text-3xl font-bold">{user?.name}</h2>
					<p className="text-muted-foreground">
						{user?.position}
					</p>
					<div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
						{user?.expertise?.map((skill, index) => (
							<Badge
								key={index}
								variant="secondary"
							>
								{skill}
							</Badge>
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent className="grid gap-6">
				<Separator />
				<div className="grid sm:grid-cols-2 gap-4">
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<span>{user?.email}</span>
						</div>
						<div className="flex items-center gap-2">
							<Phone className="h-4 w-4 text-muted-foreground" />
							<span>{user?.phone}</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-muted-foreground" />
							<span>{user?.location}</span>
						</div>
						<div className="flex items-center gap-2">
							<Building className="h-4 w-4 text-muted-foreground" />
							<span>{user?.company}</span>
						</div>
					</div>
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Briefcase className="h-4 w-4 text-muted-foreground" />
							<span>{user?.department}</span>
						</div>
						<div className="flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-muted-foreground" />
							<span>Employee ID: {user?.employeeId}</span>
						</div>
						<div className="flex items-center gap-2">
							{/*Removed Nationality Field*/}
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span>Joined {user.joinDate}</span>
						</div>
					</div>
				</div>
				<Separator />
				{/*Removed Languages and Certifications Sections*/}
				<Button className="w-full sm:w-auto">
					<Edit2 className="mr-2 h-4 w-4" /> Edit Profile
				</Button>
			</CardContent>
		</Card>
	);
}
