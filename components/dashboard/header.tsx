"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	SearchOutlined,
	BellOutlined,
	ShoppingCartOutlined,
	AppstoreOutlined,
	ExpandOutlined,
} from "@ant-design/icons";

export function Header() {
	return (
		<header className="flex h-16 items-center justify-between border-b px-4">
			<div className="flex items-center gap-4">
				<h1 className="text-xl font-semibold">
					Welcome back, Bukenya
				</h1>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative">
					<SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<Input
						placeholder="Search..."
						className="w-64 pl-10"
					/>
				</div>

				<Button
					variant="ghost"
					size="icon"
				>
					<BellOutlined className="h-5 w-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
				>
					<ShoppingCartOutlined className="h-5 w-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
				>
					<AppstoreOutlined className="h-5 w-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
				>
					<ExpandOutlined className="h-5 w-5" />
				</Button>

				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full bg-gray-200" />
					<div>
						<div className="font-medium">Json Taylor</div>
						<div className="text-sm text-gray-500">
							Web Designer
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
