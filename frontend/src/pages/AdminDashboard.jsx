import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { LineChart } from "@mui/x-charts/LineChart";
import "flowbite/dist/flowbite.css"; // Ensure Flowbite CSS is imported
import clear from "../assets/weather/0.png";
import mainlyClear from "../assets/weather/1-2-3.png";
import fog from "../assets/weather/45-48.png";
import drizzle from "../assets/weather/51-53-55.png";
import freezingDrizzle from "../assets/weather/56-57.png";
import rain from "../assets/weather/61-63-65.png";
import freezingRain from "../assets/weather/66-67.png";
import rainShowers from "../assets/weather/80-81-82.png";
import thunderstorm from "../assets/weather/95.png";
import thunderstormHail from "../assets/weather/96-99.png";

const AdminDashboard = () => {
	// State variables to store data associated with Nut Harvest
	const [formAction, setFormAction] = useState("search");
	const [pickDate, setPickDate] = useState("");
	const [nutCount, setNutCount] = useState(0);
	const [pickNumber, setPickNumber] = useState(0);
	const [years, setYears] = useState([2023, 2024]);
	const [yearlyNutCount, setYearlyNutCount] = useState([1000, 2000]);

	// State variables to store data associated with Weather
	const [weatherDates, setWeatherDates] = useState([]);
	const [weatherCodes, setWeatherCodes] = useState([]);
	const [weatherTemperatures, setWeatherTemperatures] = useState([]);
	const [todaysDate, setTodaysDate] = useState("");
	const [todaysWeatherCode, setTodaysWeatherCode] = useState("");
	const [todaysTemperature, setTodaysTemperature] = useState(0);

	// State variables to store sensor readings for current date
	const [temperature, setTemperature] = useState(0);
	const [humidity, setHumidity] = useState(0);
	const [soilMoisture, setSoilMoisture] = useState("--");
	const [rainfall, setRainfall] = useState(0);

	// State variables to store histroic sensor readings for graph
	const [sensorRainfallDates, setSensorRainfallDates] = useState([]);
	const [sensorRainfallReadings, setSensorRainfallReadings] = useState([]);
	const [sensorHumidityDates, setSensorHumidityDates] = useState([]);
	const [sensorHumidityReadings, setSensorHumidityReadings] = useState([]);
	const [sensorTemperatureDates, setSensorTemperatureDates] = useState([]);
	const [sensorTemperatureReadings, setSensorTemperatureReadings] = useState(
		[]
	);
	const [sensorSoilMoistureDates, setSensorSoilMoistureDates] = useState([]);
	const [sensorSoilMoistureReadings, setSensorSoilMoistureReadings] = useState(
		[]
	);

	// State variables to store additional dashboard data
	const [orderCount, setOrderCount] = useState(0);
	const [firstOrderDate, setFirstOrderDate] = useState("");
	const [lastOrderDate, setLastOrderDate] = useState("");
	const [tdoayAttendanceCount, setTodayAttendanceCount] = useState(0);
	const [totalEmployees, setTotalEmployees] = useState(0);

	// Using functions to display information on load
	useEffect(() => {
		get_nut_count();
		get_weather();
		getTodaysSensorData();
		getHistoricSensorData();
		getAdminDashboardData();
	}, [3]);

	// Using functions to update sensor information and dashboard values every 1 minute
	useEffect(() => {
		console.log("Initializing Interval");
		const interval = setInterval(() => {
			getTodaysSensorData();
			getHistoricSensorData();
			getAdminDashboardData();
		}, 60000);

		return () => {
			console.log("Clearing Interval");
			clearInterval(interval);
		};
	}, []);

	// Function to get the nut count for the graph
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

	// Function to get the weather data
	function get_weather() {
		axios
			.get("http://localhost:8000/api/get_weather/")
			.then((response) => {
				// Temporary arrays to store the weather data
				let tempWeatherDates = [];
				let tempWeatherCodes = [];
				let tempWeatherTemperatures = [];

				// Get today's date in local time (Sri Lanka Timezone)
				let todays_date = new Date().toISOString().split("T")[0];

				for (let i = 0; i < 14; i++) {
					if (response.data[0][i] === todays_date) {
						setTodaysDate(new Date(response.data[0][i]).toDateString());
						setTodaysWeatherCode(response.data[1][i]);
						setTodaysTemperature(response.data[2][i]);
					} else {
						tempWeatherDates.push(new Date(response.data[0][i]).toDateString());
						tempWeatherCodes.push(response.data[1][i]);
						tempWeatherTemperatures.push(response.data[2][i]);
					}
				}
				setWeatherDates(tempWeatherDates);
				setWeatherCodes(tempWeatherCodes);
				setWeatherTemperatures(tempWeatherTemperatures);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// Function to get the image based on the weather code
	function getImageFromWeatherCode(code) {
		if (code === 0) {
			return clear;
		} else if (code === 1 || code === 2 || code === 3) {
			return mainlyClear;
		} else if (code === 45 || code === 48) {
			return fog;
		} else if (code === 51 || code === 53 || code === 55) {
			return drizzle;
		} else if (code === 56 || code === 57) {
			return freezingDrizzle;
		} else if (code === 61 || code === 63 || code === 65) {
			return rain;
		} else if (code === 66 || code === 67) {
			return freezingRain;
		} else if (code === 80 || code === 81 || code === 82) {
			return rainShowers;
		} else if (code === 95) {
			return thunderstorm;
		} else if (code === 96 || code === 99) {
			return thunderstormHail;
		}
	}

	// Function to get the name of the weather condition based on the weather code
	function getNameFromWeatherCode(code) {
		if (code === 0) {
			return "Clear sky";
		} else if (code === 1 || code === 2 || code === 3) {
			return "Mainly clear, partly cloudy, and overcast";
		} else if (code === 45 || code === 48) {
			return "Fog and depositing rime fog";
		} else if (code === 51 || code === 53 || code === 55) {
			return "Drizzle: Light, moderate, and dense intensity";
		} else if (code === 56 || code === 57) {
			return "Freezing Drizzle: Light and dense intensity";
		} else if (code === 61 || code === 63 || code === 65) {
			return "Rain: Slight, moderate and heavy intensity";
		} else if (code === 66 || code === 67) {
			return "Freezing Rain: Light and heavy intensity";
		} else if (code === 80 || code === 81 || code === 82) {
			return "Rain Showers";
		} else if (code === 95) {
			return "Thunderstorm: Slight or moderate";
		} else if (code === 96 || code === 99) {
			return "Thunderstorm with slight and heavy hail";
		}
	}

	// Function to get Today's Sensor Data
	const getTodaysSensorData = () => {
		axios
			.get("http://localhost:8000/api/get_todays_sensors/")
			.then((response) => {
				setTemperature(
					response.data["Temperature"] == null
						? 0
						: response.data["Temperature"]
				);
				setHumidity(
					response.data["Humidity"] == null ? 0 : response.data["Humidity"]
				);
				setSoilMoisture(
					response.data["Soil Moisture"] == null
						? 0
						: response.data["Soil Moisture"]
				);
				setRainfall(
					response.data["Rainfall"] == null ? 0 : response.data["Rainfall"]
				);
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Function to get historic rainfall sensor readings
	const getHistoricSensorData = () => {
		axios
			.get("http://localhost:8000/api/get_historical_sensors/")
			.then((response) => {
				setSensorRainfallDates(response.data["Rainfall"][0]);
				setSensorRainfallReadings(response.data["Rainfall"][1]);
				setSensorHumidityDates(response.data["Humidity"][0]);
				setSensorHumidityReadings(response.data["Humidity"][1]);
				setSensorTemperatureDates(response.data["Temperature"][0]);
				setSensorTemperatureReadings(response.data["Temperature"][1]);
				setSensorSoilMoistureDates(response.data["Soil Moisture"][0]);
				setSensorSoilMoistureReadings(response.data["Soil Moisture"][1]);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Function to get other admin dashboard data (Orders and Employees)
	const getAdminDashboardData = () => {
		axios
			.get("http://localhost:8000/api/get_other_admin_data/")
			.then((response) => {
				setOrderCount(response.data["total_orders"]);
				setFirstOrderDate(response.data["first_order_date"]);
				setLastOrderDate(response.data["last_order_date"]);
				setTodayAttendanceCount(response.data["today_employees"]);
				setTotalEmployees(response.data["total_employees"]);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Function to handle form submission of the nut harvest
	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		// If search button was clicked
		if (formAction === "search") {
			let str_date = formData.get("pick_date");
			formData.delete("pick_date");
			let year = new Date(str_date).getFullYear();
			formData.append("year", year);

			axios
				.post("http://localhost:8000/api/search_pick/", formData)
				.then((response) => {
					toast.success("Pick Data Found");

					let formatted_date = new Date(response.data["Date"])
						.toISOString()
						.split("T")[0];
					setPickDate(formatted_date);
					setNutCount(response.data["Nuts"]);
					setPickNumber(response.data["PickNumber"]);
				})
				.catch((error) => {
					toast.error("No Pick Data Found");
					console.log(error);
				});
		}
		// If add/ update button was clicked
		else if (formAction === "add_update") {
			const confirmAddUpdate = window.confirm(
				"Are you sure you want to add/ update data?"
			);
			// Only submit the form if user agrees to add/update
			if (confirmAddUpdate) {
				let str_date = formData.get("pick_date");
				let date_obj = new Date(str_date);
				let pick_date =
					date_obj.getFullYear() +
					"/" +
					(date_obj.getMonth() + 1) +
					"/" +
					date_obj.getDate();
				formData.set("pick_date", pick_date);

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
		}
		// If delete button was clicked
		else if (formAction === "delete") {
			const confirmDelete = window.confirm(
				"Are you sure you want to delete the data?"
			);
			// Only submit the form if user agrees to delete
			if (confirmDelete) {
				let str_date = formData.get("pick_date");
				formData.delete("pick_date");
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

			{/* Start of Sensor Data, Order and Attendance Count Display */}
			<div className="flex flex-col md:flex-col mb-5">
				<div className="flex-auto w-full md:w-full p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black font-bold">
						<div className="bg-white rounded-lg p-5">
							<h1>Temperature</h1>
							<div className="text-center">
								<h3 className="text-5xl pt-3 text-blue">
									{temperature}
									<sup>o</sup>C
								</h3>
								<div>
									<LineChart
										xAxis={[
											{
												scaleType: "point",
												data: sensorTemperatureDates,
												format: (value) => value,
												tickNumber: sensorTemperatureDates.length,
											},
										]}
										series={[
											{ curve: "linear", data: sensorTemperatureReadings },
										]}
										height={150}
										margin={{ left: 40, right: 40, top: 10, bottom: 20 }}
										grid={{ vertical: true, horizontal: true }}
									/>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-lg p-5">
							<h1>Relative Humidity</h1>
							<div className="text-center">
								<h3 className="text-5xl pt-3 text-blue">{humidity}%</h3>
								<div>
									<LineChart
										xAxis={[
											{
												scaleType: "point",
												data: sensorHumidityDates,
												format: (value) => value,
												tickNumber: sensorHumidityDates.length,
											},
										]}
										series={[{ curve: "linear", data: sensorHumidityReadings }]}
										height={150}
										margin={{ left: 40, right: 40, top: 10, bottom: 20 }}
										grid={{ vertical: true, horizontal: true }}
									/>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-lg p-5">
							<h1>Soil Moisture</h1>
							<div className="text-center">
								<h3 className="text-5xl pt-3 text-blue">{soilMoisture}</h3>
								<div>
									<LineChart
										xAxis={[
											{
												scaleType: "point",
												data: sensorSoilMoistureDates,
												format: (value) => value,
												tickNumber: sensorSoilMoistureDates.length,
											},
										]}
										series={[
											{ curve: "linear", data: sensorSoilMoistureReadings },
										]}
										height={150}
										margin={{ left: 40, right: 40, top: 10, bottom: 20 }}
										grid={{ vertical: true, horizontal: true }}
									/>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-lg p-5">
							<h1>Rainfall</h1>
							<div className="text-center">
								<h3 className="text-5xl pt-3 text-blue">{rainfall} mm</h3>
								<div>
									<LineChart
										xAxis={[
											{
												scaleType: "point",
												data: sensorRainfallDates,
												format: (value) => value,
												tickNumber: sensorRainfallDates.length,
											},
										]}
										series={[{ curve: "linear", data: sensorRainfallReadings }]}
										height={150}
										margin={{ left: 40, right: 40, top: 10, bottom: 20 }}
										grid={{ vertical: true, horizontal: true }}
									/>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-lg p-5">
							<h1>Staff Attendance</h1>
							<div className="text-center">
								<h3 className="text-5xl text-blue py-5">
									{tdoayAttendanceCount}/ {totalEmployees}
								</h3>
								<h6 className="italic text-xs">
									Last Recorded Attendance:
									<br /> 5th June 2024 7:33 a.m.
								</h6>
							</div>
						</div>
						<div className="bg-white rounded-lg p-5">
							<h1>Order Summary</h1>
							<div className="text-center">
								<h3 className="text-5xl pt-5 text-blue">{orderCount}</h3>
								<h3 className="text-lg text-blue">Orders Completed</h3>
								<div className="flex justify-between text-xs italic mt-2">
									<h6>
										First Order:
										<br /> {firstOrderDate}
									</h6>
									<h6>
										Last Order:
										<br /> {lastOrderDate}
									</h6>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Start of Sensor Data, Order and Attendance Count Display */}

				{/* Start of Nut Harvest Form and Graph */}
				<div className="flex-auto w-full md:w-full p-4 rounded-lg shadow-sm">
					<div className="grid grid-cols-1 gap-8 font-bold bg-white rounded-lg p-5">
						<form
							className="border-2 rounded-lg border-black p-5"
							onSubmit={handleSubmit}
						>
							<h1 className="text-center pb-3">Nut Harvest Data</h1>
							<div className="flex flex-col md:flex-row justify-between items-center md:space-x-4 md:space-y-0 space-y-4">
								<div className="flex flex-col justify-center w-full">
									<div className="mb-2 block">
										<Label htmlFor="pick_date" value="Date" />
									</div>
									<TextInput
										id="pick_date"
										name="pick_date"
										type="date"
										placeholder="yyyy/mm/dd"
										style={{ color: "black" }}
										value={pickDate}
										onChange={(e) => setPickDate(e.target.value)}
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
								{/* <div className="flex flex-col justify-center w-full">
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
								</div> */}
							</div>

							<div className="grid grid-cols-3 gap-3 justify-center text-center pt-5">
								{/* <Button type="submit" color="success">
									Submit
								</Button> */}
								<Button
									type="submit"
									color="blue"
									onClick={() => setFormAction("search")}
								>
									Search
								</Button>
								<Button
									type="submit"
									color="success"
									onClick={() => setFormAction("add_update")}
								>
									Add/ Update
								</Button>
								<Button
									type="submit"
									color="failure"
									onClick={() => setFormAction("delete")}
								>
									Delete
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
			{/* End of Nut Harvest Form and Graph */}

			{/* Start of Weather Information Display from API */}
			<div className="mt-3 p-5">
				<div className="bg-white rounded-lg p-5 font-bold text-black h-fit">
					<div className="flex flex-col md:flex-row items-center justify-between mb-4">
						<div className="flex items-center gap-4 pb-4 md:pb-0">
							<h1 className="text-lg md:text-xl">Weather Information</h1>
						</div>
						<div className="text-center md:text-right">
							<h6 className="text-xs italic">
								Updated 5 mins ago
								<br /> Data based on Kurunegala region
							</h6>
						</div>
					</div>

					<div className="border-2 rounded p-4 mb-4">
						<div className="flex flex-col p-3">
							<h1 className="text-lg md:text-xl">Today's Weather</h1>
						</div>
						<div className="flex flex-col items-center p-4">
							<h4 className="text-md">{todaysDate}</h4>
							<img
								src={getImageFromWeatherCode(todaysWeatherCode)}
								alt="today's weather"
								className="h-24 w-24 hover:scale-125"
							/>
							<h5 className="text-xs">
								{getNameFromWeatherCode(todaysWeatherCode)}
							</h5>
							<h3 className="text-2xl text-blue">
								{todaysTemperature}
								<sup>o</sup>C
							</h3>
						</div>
					</div>

					<div className="border-2 rounded p-4 mb-4">
						<div className="flex flex-col p-3">
							<h1 className="text-lg md:text-xl">Coming Week's Weather</h1>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
							{weatherDates.slice(7, 15).map((date, index) => {
								let actualIndex = index + 7;
								return (
									<div key={index} className="flex flex-col items-center">
										<h4 className="text-md">{weatherDates[actualIndex]}</h4>
										<h3 className="text-xl text-blue">
											{weatherTemperatures[actualIndex]}
											<sup>o</sup>C
										</h3>
										<img
											src={getImageFromWeatherCode(weatherCodes[actualIndex])}
											alt="weather_image"
											className="h-24 w-24 p-3 hover:scale-125"
										/>
										<h5 className="text-xs text-center">
											{getNameFromWeatherCode(weatherCodes[actualIndex])}
										</h5>
									</div>
								);
							})}
						</div>
					</div>

					<div className="border-2 rounded p-4">
						<div className="flex flex-col p-3">
							<h1 className="text-lg md:text-xl">Last Week's Weather</h1>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4">
							{weatherDates.slice(0, 7).map((date, index) => (
								<div key={index} className="flex flex-col items-center">
									<h4 className="text-md">{weatherDates[index]}</h4>
									<h3 className="text-xl text-blue">
										{weatherTemperatures[index]}
										<sup>o</sup>C
									</h3>
									<img
										src={getImageFromWeatherCode(weatherCodes[index])}
										alt="weather_image"
										className="h-24 w-24 p-3 hover:scale-125"
									/>
									<h5 className="text-xs text-center">
										{getNameFromWeatherCode(weatherCodes[index])}
									</h5>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{/* End of Weather Information Display from API */}
		</div>
	);
};

export default AdminDashboard;
