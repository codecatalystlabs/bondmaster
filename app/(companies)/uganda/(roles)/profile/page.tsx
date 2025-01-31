import { UserProfile } from "@/components/user-profile/user-profile";

export default function ProfilePage() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">User Profile</h1>
			<UserProfile />
		</div>
	);
}
