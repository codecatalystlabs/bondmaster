// app/hooks/withAuth.tsx
"use client"; 

import { useRouter } from "next/navigation";
import useUserStore from "../store/userStore";
import { useEffect } from "react";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const token = useUserStore((state) => state.token);

	useEffect(() => {
		if (!token) {
			router.push("/signin"); 
		}
	}, [token, router]);

	return token ? <>{children}</> : null; 
};

export default WithAuth;
