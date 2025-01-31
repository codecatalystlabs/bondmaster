import { CostManagement } from "@/components/cost-management/cost-management";

export default function CostManagementPage() {
	return (
		<div className="flex-1 ">
			<h1 className="text-2xl font-bold mb-6">Cost Management</h1>
			<CostManagement />
		</div>
	);
}
