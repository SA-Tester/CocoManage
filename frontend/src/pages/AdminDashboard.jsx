import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Datepicker, Button, Label, Select, TextInput } from "flowbite-react";
import { LineChart } from "@mui/x-charts/LineChart";
import "flowbite/dist/flowbite.css"; // Ensure Flowbite CSS is imported
import rainy from "../assets/rainy.png";
import sunny from "../assets/sunny.png";
import cloudy from "../assets/cloudy.png";

const AdminDashboard = () => {
	const [formAction, setFormAction] = useState("");
	const [date, setDate] = useState("");
	const [nutCount, setNutCount] = useState(0);

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		if (formAction === "search") {
			let str_date = formData.get("date");
			formData.delete("date");
			let year = new Date(str_date).getFullYear();
			formData.append("year", year);

			axios
				.post("http://localhost:8000/api/search_pick/", formData)
				.then((response) => {
					toast.success("Pick Data Found");

					let formatted_date = new Date(response.data["Date"]).toISOString().split('T')[0];
					setDate(formatted_date);
					setNutCount(response.data["Nuts"]);
				})
				.catch((error) => {
					toast.error("No Pick Data Found");
					console.log(error);
				});
		} else if (formAction === "add_update") {
			let str_date = formData.get("date");
			let date_obj = new Date(str_date);
			let date = date_obj.getFullYear() + "/" + (date_obj.getMonth() + 1) + "/" + date_obj.getDate();
			formData.set("date", date);

			axios
				.post("http://localhost:8000/api/add_update_pick/", formData)
				.then((response) => {
					toast.success("Nut Harvest Updated Successfully");
					console.log(response.data);
				})
				.catch((error) => {
					toast.error("Error Updating Nut Harvest");
					console.log(error);
				});
		} else if (formAction === "delete") {
		}
	};

	return (
		<div className="flex flex-col md:flex-row left-0 w-full absolute bg-green p-5">
			<ToastContainer />

			<div className="flex-auto w-full md:w-1/2 lg:w-1/2 p-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black font-bold">
					<div className="bg-white rounded-lg p-5">
						<h1>Temperature</h1>
						<div className="text-center">
							<h3 className="text-5xl pt-3 text-blue">
								35<sup>o</sup>C
							</h3>
							<div>
								<LineChart
									xAxis={[{ data: [1, 2, 3, 4, 5] }]}
									series={[{ curve: "linear", data: [2, 5.5, 1, 3.5, 0.5] }]}
									height={150}
									margin={{ left: 30, right: 10, top: 10, bottom: 20 }}
									grid={{ vertical: true, horizontal: true }}
								/>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg p-5">
						<h1>Relative Humidity</h1>
						<div className="text-center">
							<h3 className="text-5xl pt-3 text-blue">35 %</h3>
							<div>
								<LineChart
									xAxis={[{ data: [1, 2, 3, 4, 5] }]}
									series={[{ curve: "linear", data: [2, 8.5, 1.5, 5, 3.2] }]}
									height={150}
									margin={{ left: 30, right: 10, top: 10, bottom: 20 }}
									grid={{ vertical: true, horizontal: true }}
								/>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg p-5">
						<h1>Soil Moisture</h1>
						<div className="text-center">
							<h3 className="text-5xl pt-3 text-blue">35 %</h3>
							<div>
								<LineChart
									xAxis={[{ data: [1, 2, 3, 4, 5] }]}
									series={[{ curve: "linear", data: [2, 2, 2.5, 1.5, 3] }]}
									height={150}
									margin={{ left: 30, right: 10, top: 10, bottom: 20 }}
									grid={{ vertical: true, horizontal: true }}
								/>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg p-5">
						<h1>Rainfall</h1>
						<div className="text-center">
							<h3 className="text-5xl pt-3 text-blue">35 mm</h3>
							<div>
								<LineChart
									xAxis={[{ data: [1, 2, 3, 4, 5] }]}
									series={[{ curve: "linear", data: [2, 4, 2, 6, 2] }]}
									height={150}
									margin={{ left: 30, right: 10, top: 10, bottom: 20 }}
									grid={{ vertical: true, horizontal: true }}
								/>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg p-5">
						<h1>Staff Attendance</h1>
						<div className="text-center">
							<h3 className="text-5xl text-blue py-5">29/ 60</h3>
							<h6 className="italic text-xs">
								Last Recorded Attendance:
								<br /> 5th June 2024 7:33 a.m.
							</h6>
						</div>
					</div>
					<div className="bg-white rounded-lg p-5">
						<h1>Order Summary</h1>
						<div className="text-center">
							<h3 className="text-5xl pt-5 text-blue">128</h3>
							<h3 className="text-lg text-blue">Orders Completed</h3>
							<div className="flex justify-between text-xs italic mt-2">
								<h6>
									First Order:
									<br /> 12th May 2024
								</h6>
								<h6>
									Last Order:
									<br /> 30th May 2024
								</h6>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex-auto w-full md:w-1/2 lg:w-1/2 p-4 rounded-lg shadow-md grid grid-cols-1 gap-8">
				<div className="grid grid-cols-1 grid-rows-2 gap-8 font-bold bg-white rounded-lg p-5">
					<form
						className="border-2 rounded-lg border-black p-5"
						onSubmit={handleSubmit}
					>
						<h1 className="text-center pb-3">Nut Harvest</h1>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
							<div className="flex flex-col justify-center w-full">
								<div className="mb-2 block">
									<Label
										htmlFor="pick_number"
										value="Pick Number: "
										style={{ color: "black" }}
									/>
								</div>
								<Select
									id="pick_number"
									name="pick_number"
									className="bg-grey rounded-md w-full text-black"
									style={{ color: "black" }}
									required
								>
									<option>1</option>
									<option>2</option>
									<option>3</option>
									<option>4</option>
									<option>5</option>
									<option>6</option>
									<option>7</option>
								</Select>
							</div>
							<div className="flex flex-col justify-center w-full">
								<div className="mb-2 block">
									<Label
										htmlFor="date"
										value="Date: "
										style={{ color: "black" }}
									/>
								</div>
								<TextInput
									id="date"
									name="date"
									type="date"
									placeholder="yyyy/mm/dd"
									style={{ color: "black" }}
									value={date}
									onChange={(e) => setDate(e.target.value)}
									required
								/>
								{/* <Datepicker
									id="date"
									name="date"
									placement="bottom"
									className="border border-gray-300 rounded-md p-2"
									style={{ color: "black" }}
									onChange={(e) => setDate(e.target.value)}
									// value = {date}
								/> */}
							</div>
							<div className="flex flex-col justify-center w-full">
								<div className="mb-2 block">
									<Label
										htmlFor="nut_count"
										value="Nut Count: "
										style={{ color: "black" }}
									/>
								</div>
								<TextInput
									id="nut_count"
									name="nut_count"
									type="number"
									placeholder="0"
									style={{ color: "black" }}
									value={nutCount}
									onChange={(e) => setNutCount(e.target.value)}
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-5">
							<Button
								color="success"
								type="submit"
								onClick={() => setFormAction("search")}
							>
								Search
							</Button>
							<Button
								color="success"
								type="submit"
								onClick={() => setFormAction("add_update")}
							>
								Add/ Update
							</Button>
							<Button
								color="success"
								type="submit"
								onClick={() => setFormAction("delete")}
							>
								Delete
							</Button>
						</div>
						<p className="text-xs text-right py-3 italic">
							**Select the pick number and the year to search
						</p>
					</form>
					<div className="flex flex-col h-100 items-center">
						<h2>Nut Harvest Variation</h2>
						<LineChart
							xAxis={[
								{
									scaleType: "time",
									data: [
										new Date(2019, 0, 1),
										new Date(2020, 0, 1),
										new Date(2021, 0, 1),
										new Date(2022, 0, 1),
										new Date(2023, 0, 1),
									],
									valueFormatter: (date) => date.getFullYear().toString(),
									tickNumber: 5,
								},
							]}
							series={[
								{ curve: "linear", data: [5500, 4500, 3452, 6123, 4123] },
							]}
							height={150}
							margin={{ left: 50, right: 20, top: 10, bottom: 20 }}
							grid={{ vertical: true, horizontal: true }}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-8 text-black font-bold bg-white rounded-lg p-5 text-center">
					<h1>Weather Prediction</h1>
					<div className="grid grid-cols-3 gap-4">
						<div className="flex flex-col items-center text-grey">
							<img
								src={sunny}
								alt="Sunny Day"
								className="object-cover md:h-full md:w-16"
							/>
							<h3>Yesterday</h3>
							<h6 className="text-xs">6th July</h6>
							<h2>
								32<sup>0</sup>C
							</h2>
						</div>
						<div className="flex flex-col items-center">
							<img
								src={rainy}
								alt="Rainy Day"
								className="object-cover md:h-full md:w-16"
							/>
							<h3>Today</h3>
							<h6 className="text-xs">7th July</h6>
							<h2>
								25<sup>0</sup>C
							</h2>
						</div>
						<div className="flex flex-col items-center text-grey">
							<img
								src={cloudy}
								alt="Cloudy Day"
								className="object-cover md:h-full md:w-16"
							/>
							<h3>Yesterday</h3>
							<h6 className="text-xs">8th July</h6>
							<h2>
								27<sup>0</sup>C
							</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
