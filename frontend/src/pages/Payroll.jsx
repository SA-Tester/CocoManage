import React, { lazy, useState, useEffect } from "react";
import { Card } from "flowbite-react";
import axios from "axios";
const Table = lazy(() => import("../components/payroll/Table"));

const Payroll = () => {
	const [dashboardData, setDashboardData] = useState({
		current_month: "",
		current_year: "",
		total_employees: 0,
		total_salary_paid: 0,
	});

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const response = await axios.get(
					"http://127.0.0.1:8000/api/payroll_dashboard_data/"
				);
				setDashboardData(response.data);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			}
		};

		fetchDashboardData();
	}, []);

	return (
		<React.Fragment>
			{/*Main Title*/}
			<section className="bg-green mt-3 md:mt-3 lg:mt-7 p-8">
				<h1 className="text-xl font-bold text-paleCream md:text-2xl xl:text-3xl text-left">
					Payroll Management Dashboard
				</h1>
			</section>

			{/* Overall Pyroll Details Section */}
			<div className="bg-green pt-6 pb-12">
				<section className="px-8 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8">
					{/*Month*/}
					<div className="col-span-1 md:col-span-4 lg:col-span-4">
						<Card className="h-full max-w-sm mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
							<div className="p-6 text-center">
								<h3 className="text-xl font-semibold text-green">Month</h3>
								<h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-light-green py-4">
									{dashboardData.current_month}
								</h1>
								<p className="text-base text-black">
									{dashboardData.current_year}
								</p>
							</div>
						</Card>
					</div>
					{/*Total Employees*/}
					<div className="col-span-1 md:col-span-4 lg:col-span-4">
						<Card className="h-full max-w-sm mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
							<div className="p-6 text-center">
								<h3 className="text-xl font-semibold text-green">
									Total Employees
								</h3>
								<h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-light-green py-4">
									{dashboardData.total_employees}
								</h1>
								<p className="text-base text-black">Employees</p>
							</div>
						</Card>
					</div>

					{/*Total salary paid*/}
					<div className="col-span-1 md:col-span-4 lg:col-span-4">
						<Card className="h-full max-w-sm mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
							<div className="p-6 text-center">
								<h3 className="text-xl font-semibold text-green">
									Total Salary Paid
								</h3>
								<h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-light-green py-4">
									{dashboardData.total_salary_paid}
								</h1>
								<p className="text-base text-black">Rs.</p>
							</div>
						</Card>
					</div>
				</section>
			</div>

			{/*Payroll Calculation*/}
			<div className="bg-green p-4 pb-24">
				<div className="bg-white rounded-lg p-4 py-10">
					<Table />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Payroll;
