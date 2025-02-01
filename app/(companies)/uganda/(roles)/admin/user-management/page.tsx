import WithAuth from "@/app/hooks/withAuth";
import { UserManagement } from "@/components/user-management/user-management";

export default function UserManagementPage() {
	return (
		<WithAuth>
		<div className="p-8">
			<UserManagement />
		</div>
		</WithAuth>
	);
}
