import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";
import axios from "axios";
import img1 from "../assets/image1.jpg";

const SignUp = () => {
	const [nic, setNic] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	//frontend form validations
	const validateEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSignupForm = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!validateEmail(email)) {
			setError("Invalid email address.");
			return;
		}

		if (nic.length !== 10 && nic.length !== 12) {
			setError("Your NIC number should contain 10 or 12 characters.");
			return;
		}

		if (password.length < 6) {
			setError("Password should be at least 6 characters long.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post("http://127.0.0.1:8000/api/signup/", {
				nic,
				email,
				password,
				confirmPassword,
			});
			setSuccess("Signup Successful!");
			console.log(response);
			navigate("/signin");
			
		} catch (err) {
			setError("Signup Failed: " + (err.response?.data?.error || err.message));
		} finally {
			setLoading(false);
		}
	};

	return (
		<React.Fragment>
			<div className="bg-white">
				<section className=" grid grid-cols-12 overflow-hidden">
					{/*Sign up section*/}
					<div className="col-span-12 px-24 py-10 rounded-md bg-white  shadow-md md:col-span-6 lg:col-span-6">
						<h1 className="text-xl text-center font-bold text-green md:text-2xl xl:text-3xl">
							Welcome to CoCoManage
						</h1>
						<p className="text-md mt-3 text-center text-gray-700">
							Already have an account?
							<span>
								<a href="/signin" className="text-light-green underline ml-1">
									Login here
								</a>
							</span>
						</p>

						{/*Registration from*/}
						<form
							className="flex items-center justify-center"
							onSubmit={handleSignupForm}
						>
							<div className="w-full pt-5 ">
								<div className="mt-2 mb-3">
									{error && <p style={{ color: "red" }}>{error}</p>}
									{success && <p style={{ color: "green" }}>{success}</p>}
								</div>
								{/*email*/}
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
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										color={"dark"}
									/>
								</div>
								{/*NIC*/}
								<div className="mb-6">
									<div className="mb-2 block">
										<Label
											htmlFor="nic"
											value="NIC Number"
											className="capitalize"
										/>
									</div>
									<TextInput
										id="nic"
										name="nic"
										type="text"
										value={nic}
										onChange={(e) => setNic(e.target.value)}
										required
										color={"dark"}
									/>
								</div>
								{/*password*/}
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
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										color={"dark"}
									/>
								</div>
								{/*Confirm Password*/}
								<div className="mb-6">
									<div className="mb-2 block">
										<Label
											htmlFor="confirm_password"
											value="Confirm Password"
											className="capitalize"
										/>
									</div>
									<TextInput
										id="confirm_password"
										name="confirm_password"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										color={"dark"}
									/>
								</div>
								{/*button*/}
								<section className="mt-9 flex items-start justify-end">
									<Button
										type="submit"
										size={"xs"}
										className="w-full rounded-lg bg-green py-1 uppercase text-white hover:!bg-light-green"
										disabled={loading}
									>
										{loading ? "Signing Up..." : "Sign Up"}
									</Button>
								</section>
							</div>
						</form>
					</div>

					{/*image section*/}
					<div className="col-span-12 md:col-span-6  lg:col-span-6">
						<img src={img1} alt="Coconut Trees" className="w-full h-auto" />
					</div>
				</section>
			</div>
		</React.Fragment>
	);
};

export default SignUp;
