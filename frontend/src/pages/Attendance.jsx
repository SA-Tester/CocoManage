import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Table, Button } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../components/common/Spinner";
import "react-toastify/dist/ReactToastify.css";

const Attendance = () => {
	// State to store the current date
	const [currentDate, setCurrentDate] = useState(getDate());
	const [currentTime, setCurrentTime] = useState(getTime());

	// Initialize the webcam reference and image source
	const webcamRef = React.useRef(null);
	const [imgSrc, setImgSrc] = React.useState(null);

	// Initialize spinner
	const [loading, setLoading] = useState(false);

	// Function to get the current date in the desired format
	function getDate() {
		const today = new Date();
		const month = today.getMonth() + 1;
		const year = today.getFullYear();
		const date = today.getDate();
		return `${date}/${month}/${year}`;
	}

	// Function to get the current time in the desired format
	function getTime() {
		const current = new Date();
		const hours = current.getHours();
		const minutes = current.getMinutes();
		const seconds = current.getSeconds();
		return `${hours}:${minutes}:${seconds}`;
	}

	// Funtion to get the attendance data from the backend
	function get_attendance() {
		axios
			.get("http://localhost:8000/api/get_attendance/")
			.then((response) => {
				setAttendanceData(response.data);
			})
			.catch((error) => {
				console.error(
					"There was an error fetching the attendance data!",
					error
				);
			});
	}

	// Function to get a photo from the webcam
	const capture = React.useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();
		setImgSrc(imageSrc);

		setLoading(true)

		// Convert the data URL to a Blob
		const byteString = atob(imageSrc.split(",")[1]); // Decode data which has been encoded using Base64 encoding
		const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// Create a Blob from the ArrayBuffer
		const blob = new Blob([ab], { type: mimeString });

		// Create a FormData object
		const formData = new FormData();
		formData.append("photo", blob, "photo.jpg");

		// Send the photo to the Django server
		axios
			.post("http://localhost:8000/api/verify/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			// Handle the response from the server [success]
			.then((response) => {
				console.log("Employee no:", response.data);
				toast.success("Employee verified successfully!");
				setCurrentDate(getDate());
				setCurrentTime(getTime());
				get_attendance();
				setLoading(false);
			})
			// Handle the response from the server [error]
			.catch((error) => {
				console.error("Error:", error);
				toast.error("Unidentified. Please try again!");
				setLoading(false);
			});
	}, [webcamRef, setImgSrc]);

	// Render the attendance page
	const [attendance_data, setAttendanceData] = useState([]);

	// Fetch the attendance data from the backend
	useEffect(() => {
		get_attendance();
	},[]);

	return (
		// Main container for the attendance page
		<div className="flex flex-col md:flex-row left-0 w-full h-screen text-white absolute bg-green pl-5 pr-5 pt-5">
			{/* Rendering the Toast Container for Notifications */}
			<ToastContainer />

			{/* Spinner for loading state */}
			{loading && <Spinner />}

			{/* Left section for greeting and webcam */}
			<div className="flex-auto w-full md:w-1/3 lg:w-1/2 p-4 sm:p-2 md:p-3 lg:p-4">
				<div className="text-left pt-5">
					<h1 className="text-3xl font-bold">Good Morning!</h1>
					<h6 className="text-xs italic pt-5 pb-10">Date: {currentDate}</h6>
				</div>
				<div className="flex flex-col justify-center border-solid border-2 border-black size-fit">
					<Webcam
						audio={false}
						height={720}
						width={1280}
						screenshotFormat="image/jpeg"
						className="w-100 h-96"
						ref={webcamRef}
					/>
					<Button
						onClick={capture}
						className="font-bold bg-grey hover:bg-light-grey hover:text-black"
					>
						Capture
					</Button>
				</div>
			</div>

			{/* Right section for attendance summary and table */}
			<div className="flex-auto w-full md:w-2/3 lg:w-1/2 p-4 sm:p-2 md:p-3 lg:p-4">
				<div className="text-right font-bold pt-5">
					<h3 className="text-md pb-5">Total Recorded Attendance:</h3>
					<h6 className="text-xs italic pt-3">
						Last Updated At: {currentDate} {currentTime}
					</h6>
				</div>
				<div className="pt-10 overflow-x-auto">
					<Table className="text-center text-xs">
						<Table.Head className="bg-grey">
							<Table.HeadCell>Employee No</Table.HeadCell>
							<Table.HeadCell>Name</Table.HeadCell>
							<Table.HeadCell>Time</Table.HeadCell>
							<Table.HeadCell>Total Attendance Per Month</Table.HeadCell>
						</Table.Head>
						<Table.Body className="pt-3 pb-3 bg-light-grey text-black">
							{Object.entries(attendance_data).map(([key, value]) =>
								Object.entries(value).map(([subKey, subValue]) => (
									<Table.Row key={`${key}-${subKey}`}>
										<Table.Cell>{subValue.emp_no}</Table.Cell>
										<Table.Cell>{subValue.emp_name}</Table.Cell>
										<Table.Cell>{subValue.today_time}</Table.Cell>
										<Table.Cell>{subValue.tot_att_per_month}</Table.Cell>
									</Table.Row>
								))
							)}
						</Table.Body>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Attendance;
