import WithAuth from '@/app/hooks/withAuth'
import { CustomerManagement } from '@/components/customer-management/customer-management'

export default function CustomerManagementPage() {
  return (
    <WithAuth>
    <div className="p-2">
      <CustomerManagement />
    </div>
    </WithAuth>
  )
}

