import WithAuth from "@/app/hooks/withAuth";
import { CostManagement } from "@/components/cost-management/cost-management";

export default function CostManagementPage() {
  return (
    <WithAuth>

    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Cost Management</h1>
      <CostManagement />
    </div>
    </WithAuth>
  )
}

