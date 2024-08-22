import React from "react";

const Unauthorized = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
				<h1 className="text-3xl font-bold text-red-600 mb-4">
					Unauthorized Access
				</h1>
				<p className="text-gray-700 mb-6">
					You do not have permission to view this page.
				</p>
				<a href="/admin_dashboard" className="text-blue-500 hover:underline">
					Go back to Home
				</a>
			</div>
		</div>
	);
};

export default Unauthorized;
