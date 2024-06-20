import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { LineChart } from "@mui/x-charts/LineChart";
import "flowbite/dist/flowbite.css"; // Ensure Flowbite CSS is imported
import rainy from "../assets/rainy.png";
import sunny from "../assets/sunny.png";
import cloudy from "../assets/cloudy.png";

const AdminDashboard = () => {
	const [formAction, setFormAction] = useState("search");
	const [date, setDate] = useState("");
	const [nutCount, setNutCount] = useState(0);
	const [pickNumber, setPickNumber] = useState(0);
	const [years, setYears] = useState([2023, 2024]);
	const [yearlyNutCount, setYearlyNutCount] = useState([1000, 2000]);

	function get_nut_count() {
		axios
			.get("http://localhost:8000/api/get_nut_count/")
			.then((response) => {
				setYears(response.data["Years"]);
				setYearlyNutCount(response.data["Nuts"]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		get_nut_count();
	}, []);

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

					let formatted_date = new Date(response.data["Date"])
						.toISOString()
						.split("T")[0];
					setDate(formatted_date);
					setNutCount(response.data["Nuts"]);
					setPickNumber(response.data["PickNumber"]);
				})
				.catch((error) => {
					toast.error("No Pick Data Found");
					console.log(error);
				});
		} else if (formAction === "add_update") {
			const confirmAddUpdate = window.confirm(
				"Are you sure you want to add/ update data?"
			);
			if (confirmAddUpdate) {
				let str_date = formData.get("date");
				let date_obj = new Date(str_date);
				let date =
					date_obj.getFullYear() +
					"/" +
					(date_obj.getMonth() + 1) +
					"/" +
					date_obj.getDate();
				formData.set("date", date);

				axios
					.post("http://localhost:8000/api/add_update_pick/", formData)
					.then((response) => {
						get_nut_count();
						toast.success("Nut Harvest Updated Successfully");
						console.log(response.data);
					})
					.catch((error) => {
						toast.error("Error Updating Nut Harvest");
						console.log(error);
					});
			}
		} else if (formAction === "delete") {
			const confirmDelete = window.confirm(
				"Are you sure you want to delete the data?"
			);
			if (confirmDelete) {
				let str_date = formData.get("date");
				formData.delete("date");
				let year = new Date(str_date).getFullYear();
				formData.append("year", year);

				axios
					.post("http://localhost:8000/api/delete_pick/", formData)
					.then((response) => {
						toast.success("Pick Deleted Successfully");
						console.log(response.data);
					})
					.catch((error) => {
						toast.error("No Pick Data Found");
						console.log(error);
					});
			}
		}
	};

	return (
		<div className="flex flex-col w-full p-5 bg-green mt-5">
			<ToastContainer />

			<div className="flex flex-col md:flex-row mb-5">
				<div className="flex-auto w-full md:w-1/2 p-4">
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

				<div className="flex-auto w-full md:w-1/2 p-4 rounded-lg shadow-sm">
					<div className="grid grid-cols-1 gap-8 font-bold bg-white rounded-lg p-5">
						<form
							className="border-2 rounded-lg border-black p-5"
							onSubmit={handleSubmit}
						>
							<h1 className="text-center pb-3">Nut Harvest Data</h1>
							<div className="flex flex-col md:flex-row justify-between items-center md:space-x-4 md:space-y-0 space-y-4">
								<div className="flex flex-col justify-center w-full">
									<div className="mb-2 block">
										<Label htmlFor="date" value="Date" />
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
								</div>
								<div className="flex flex-col justify-center w-full">
									<div className="mb-2 block">
										<Label htmlFor="pickNumber" value="Pick Number" />
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
										<Label htmlFor="nut_count" value="Nuts Harvested" />
									</div>
									<TextInput
										id="nut_count"
										type="number"
										name="nut_count"
										required={true}
										shadow={true}
										value={nutCount}
										onChange={(e) => setNutCount(e.target.value)}
									/>
								</div>
								<div className="flex flex-col justify-center w-full">
									<div className="mb-2 block">
										<Label htmlFor="formAction" value="Action" />
									</div>
									<Select
										id="formAction"
										name="formAction"
										required={true}
										shadow={true}
										onChange={(e) => setFormAction(e.target.value)}
										defaultValue={formAction}
									>
										<option value="search">Search</option>
										<option value="add_update">Add/Update</option>
										<option value="delete">Delete</option>
									</Select>
								</div>
							</div>

							<div className="flex justify-center text-center pt-5">
								<Button type="submit" color="success">
									Submit
								</Button>
							</div>
						</form>

						<div className="bg-white rounded-lg p-5">
							<h1 className="text-center text-2xl pb-5">
								Yearly Nut Production
							</h1>
							<LineChart
								xAxis={[
									{
										scaleType: "time",
										data: years.map((year) => new Date(year, 0, 1)),
										valueFormatter: (date) => date.getFullYear().toString(),
										tickNumber: years.length,
									},
								]}
								series={[{ curve: "linear", data: yearlyNutCount }]}
								height={420}
								margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
								grid={{ vertical: true, horizontal: true }}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-3 p-5">
				<div className="bg-white rounded-lg p-5 font-bold text-black h-fit">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="flex items-center gap-4 pb-4 md:pb-0">
							<h1>Weather Prediction</h1>
						</div>
						<div className="text-center md:text-right">
							<h6 className="text-xs italic">
								Updated 5 mins ago
								<br /> Data based on Colombo region
							</h6>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
						<div className="flex flex-col items-center">
							<img src={rainy} alt="rainy" className="h-16 w-16" />
							<h3 className="text-xl text-blue">
								28<sup>o</sup>C
							</h3>
						</div>
						<div className="flex flex-col items-center">
							<img src={cloudy} alt="cloudy" className="h-16 w-16" />
							<h3 className="text-xl text-blue">
								32<sup>o</sup>C
							</h3>
						</div>
						<div className="flex flex-col items-center">
							<img src={sunny} alt="sunny" className="h-16 w-16" />
							<h3 className="text-xl text-blue">
								30<sup>o</sup>C
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
