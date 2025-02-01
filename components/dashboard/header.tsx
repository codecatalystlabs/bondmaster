"use client";

import useUserStore from "@/app/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	SearchOutlined,
	BellOutlined,
	ShoppingCartOutlined,
	AppstoreOutlined,
	ExpandOutlined,
} from "@ant-design/icons";

const locationFlags: { [key: string]: string } = {
	Uganda: "🇺🇬",
	Japan: "🇯🇵",
	USA: "🇺🇸",
	Kenya: "🇰🇪",
	// Add more locations as needed
};

export function Header() {
	const user = useUserStore((state) => state.user);
	const location = user?.location || "Unknown";
	const flag = locationFlags[location] || "🏳️"; 

	return (
		<header className="flex h-16 items-center justify-between border-b px-4">
			<div className="flex items-center gap-4">
				<h1 className="text-xl font-semibold">
					Welcome back, {user?.username || "Guest"} - {user?.location}
				</h1>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative">
					<SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<Input placeholder="Search..." className="w-64 pl-10" />
				</div>

				<Button variant="ghost" size="icon">
					<BellOutlined className="h-5 w-5" />
				</Button>

			


				<div className="flex items-center gap-3">
					{/* Avatar with flag */}
					<div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-lg">
						{flag}
					</div>
					<div>
						<div className="font-medium">{user?.username || "Guest"}</div>
						<div className="text-sm text-gray-500">{user?.group || "User"}</div>
					</div>
				</div>
			</div>
		</header>
	);
}
