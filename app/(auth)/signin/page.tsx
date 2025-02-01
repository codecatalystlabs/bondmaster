import { SignIn } from "@/components/auth/signn-in";
import React from "react";

const page = () => {
	return (
		<div className="absolute inset-0 flex w-full bg-gray-700 items-center justify-center">
		
			<SignIn />
		</div>
	);
};

export default page;
