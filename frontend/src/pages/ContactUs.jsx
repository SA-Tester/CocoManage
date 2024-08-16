import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { TextInput, Textarea, Button } from "flowbite-react";
import img1 from "../assets/ContactUs.jpg";
import Spinner from "../components/common/Spinner";

const ContactUs = () => {
	// Initialize spinner
	const [loading, setLoading] = useState(false);

	// Reference to the form (reset form after submission)
	const formRef = useRef(null);

	const sendEmail = (e) => {
		e.preventDefault();
		setLoading(true);

		let formData = new FormData(e.target);
		axios
			.post("http://localhost:8000/api/send_message/", formData)
			.then((res) => {
				setLoading(false);
				toast.success("Message sent successfully");
				formRef.current.reset(); // Reset the form fields
				console.log(res);
			})
			.catch((err) => {
				setLoading(false);
				toast.error("Failed to send message");
				console.log(err);
			});
	};

	return (
		<React.Fragment>
			<ToastContainer />

			{/* Spinner for loading state */}
			{loading && <Spinner />}

			<div className="bg-white">
				<section className=" grid grid-cols-12 overflow-hidden pt-3">
					{/*Contact Us form section*/}
					<div className="col-span-12 px-24 py-10  bg-white  shadow-md md:col-span-6 lg:col-span-6 lg:mt-6 ">
						<h1 className="text-xl  pt-8 text-center text-green md:text-2xl xl:text-4xl">
							CONTACT
							<br />
							<span className="font-extrabold pt-2">US NOW</span>
						</h1>
						<p className="text-sm pt-6 text-gray-700">
							Send us a message with your problem, and we will get back to you
							as soon as possible. Your satisfaction is our priority.
						</p>

						{/*Contact Us from*/}
						<form
							ref={formRef}
							className="flex items-center justify-center pt-4"
							onSubmit={(e) => sendEmail(e)}
						>
							<div className="w-full pt-5 ">
								{/*Name*/}
								<div className="mb-6">
									<TextInput
										id="name"
										name="name"
										type="text"
										placeholder="Name"
										required
									/>
								</div>
								{/*email*/}
								<div className="mb-6">
									<TextInput
										id="email"
										name="email"
										type="email"
										placeholder="Email"
										required
									/>
								</div>
								{/*message*/}
								<div className="mb-6">
									<Textarea
										id="message"
										name="message"
										placeholder="Enter your message"
										className="p-3"
										rows={4}
										required
									/>
								</div>
								{/*button*/}
								<section className="mt-9 flex items-start justify-end">
									<Button
										size={"xs"}
										type="submit"
										className="w-full rounded-2xl bg-green py-1 uppercase text-white hover:!bg-light-green"
									>
										send Message
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

export default ContactUs;
