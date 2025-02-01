import { SalesModule } from "@/components/sales/sales-module";

export default function SalesPage() {
	return (
		<div className="flex-1 overflow-y-auto p-8">
			<div className="grid gap-6">
				{" "}
				<h1 className="text-2xl font-bold mb-6">
					Sales Management
				</h1>
				<SalesModule />
			</div>
		</div>
	);
}
