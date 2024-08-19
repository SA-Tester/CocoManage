import React, { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import img1 from "../assets/image1.jpg"; // Ensure this image path is correct

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const validateEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (!validateEmail(email)) {
			setError("Invalid email address.");
			return;
		}

		let formData = new FormData();
		formData.append("email", email);
		formData.append("password", password);

		axios
			.get("http://localhost:8000/api/signin/")
			.then((response) => {
				setLoading(false);
				setSuccess("Login Successful!");
				console.log(response);
			})
			.catch((error) => {
				setLoading(false);
				setError("Login Failed: " + (error.response?.data?.error || error.message));
				console.log(error);
			});
	};

	return (
		<React.Fragment>
			<div className="bg-white h-screen flex items-center justify-center">
				<section className="grid grid-cols-12 overflow-hidden w-full">
					{/* Login section */}
					<div className="col-span-12 px-24 py-10 rounded-md bg-white shadow-md md:col-span-6 lg:col-span-6 flex flex-col justify-center">
						<h1 className="text-xl text-center font-bold text-green md:text-2xl xl:text-3xl">
							Welcome Back to CoCoManage
						</h1>
						<p className="text-md mt-3 text-center text-gray-700">
							Don't have an account?
							<span>
								<a href="/signup" className="text-light-green underline ml-1">
									Sign up here
								</a>
							</span>
						</p>

						<div className="mt-2 mb-3">
							{error && <p style={{ color: "red" }}>{error}</p>}
							{success && <p style={{ color: "green" }}>{success}</p>}
						</div>

						{/* Login form */}
						<form className="flex items-center justify-center" onSubmit={(e) => handleLogin()}>
							<div className="w-full pt-5">
								{/* Email */}
								<div className="mb-6">
									<div className="mb-2 block">
										<Label
											htmlFor="email"
											value="email"
											className="capitalize"
										/>
									</div>
									<TextInput
										id="email"
										name="email"
										type="email"
										placeholder="Enter Email"
										color={"dark"}
										onChange={(e) => setEmail(e.target.value)}
										required
										shadow
									/>
								</div>
								{/* Password */}
								<div className="mb-6">
									<div className="mb-2 block">
										<Label
											htmlFor="password"
											value="Password"
											className="capitalize"
										/>
									</div>
									<TextInput
										id="password"
										name="password"
										type="password"
										placeholder="Enter Password"
										color={"dark"}
										onChange={(e) => setPassword(e.target.value)}
										required
										shadow
									/>
								</div>
								{/* Button */}
								<section className="mt-9 flex items-start justify-end">
									<Button
										size={"xs"}
										type="submit"
										className="w-full rounded-lg bg-green py-1 uppercase text-white hover:!bg-light-green"
										disabled={loading}
									>
										{loading ? "Signing You In..." : "Sign In"}
									</Button>
								</section>
							</div>
						</form>
					</div>

					{/* Image section */}
					<div className="col-span-12 md:col-span-6 lg:col-span-6">
						<img
							src={img1}
							alt="Coconut Trees"
							className="w-full h-full object-cover"
						/>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
};

export default SignIn;
