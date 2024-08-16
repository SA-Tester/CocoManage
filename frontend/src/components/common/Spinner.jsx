import React from "react";
import spinner from "../../assets/spinner.gif";

function Spinner() {
	return (
		<div className="flex flex-col fixed inset-0 items-center justify-center bg-black bg-opacity-70 z-50">
			<img src={spinner} className="w-24 h-24 mb-4" alt="Loading..." />
			<p className="text-lg text-white text-center">
				Please wait while we complete the process...
			</p>
		</div>
	);
}

export default Spinner;
