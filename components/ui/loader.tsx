import React from "react";
import "./style.css";

export function Loader() {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<span className="loader">Loading</span>
		</div>
	);
}
