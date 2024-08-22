import React, { useState } from "react";
import logo from "../../assets/logo.png";

// Navbar for Attendance Component of Application
const Navbar2 = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-badge text-black fixed w-full top-0 left-0 shadow-md z-10">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				<div className="text-lg font-bold">
					<a href="/admin_dashboard">
						<img src={logo} alt="Logo" className="w-24 md:w-32 lg:w-40" />
					</a>
				</div>

				<div className="hidden md:flex space-x-4">
					<a
						href="/signin"
						className="bg-white py-2 px-4 rounded-md border border-black hover:bg-gray-300 transition duration-300 ease-in-out"
					>
						Sign In
					</a>
					<a
						href="/signup"
						className="bg-white py-2 px-4 rounded-md border border-black hover:bg-gray-300 transition duration-300 ease-in-out"
					>
						Sign Up
					</a>
				</div>
				<div className="md:hidden">
					<button
						className="text-black focus:outline-none"
						onClick={() => setIsOpen(!isOpen)}
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16m-7 6h7"
							></path>
						</svg>
					</button>
				</div>
			</div>
			{isOpen && (
				<div className="md:hidden bg-badge py-2">
					<a
						href="/signin"
						className="block bg-white py-2 px-4 rounded-md border border-black hover:bg-gray-300 transition duration-300 ease-in-out"
					>
						Sign In
					</a>
					<a
						href="/signup"
						className="block bg-white py-2 px-4 rounded-md border border-black hover:bg-gray-300 transition duration-300 ease-in-out"
					>
						Sign Up
					</a>
				</div>
			)}
		</nav>
	);
};

export default Navbar2;
