import { lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Attendance from "./pages/Attendance.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Order from "./pages/Order.jsx";
import OrderManagement from "./pages/OrderManagement.jsx";
import ClientAccount from "./pages/ClientAccount.jsx";
import StaffDirectory from "./pages/StaffDirectory.jsx";
import Cart from "./pages/Cart.jsx";

const Home = lazy(() => import("../src/pages/Home.jsx"));
const Payroll = lazy(() => import("../src/pages/Payroll.jsx"));
const ContactUs = lazy(() => import("../src/pages/ContactUs.jsx"));

const App = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="attendance" element={<Attendance />} />
					<Route path="admin_dashboard" element={<AdminDashboard />} />
					<Route path="signin" element={<SignIn />} />
					<Route path="signup" element={<SignUp />} />
					<Route path="order" element={<Order />} />
					<Route path="order_management" element={<OrderManagement />} />
					<Route path="client_account" element={<ClientAccount />} />
					<Route path="staff_directory" element={<StaffDirectory />} />
					<Route path="payroll" element={<Payroll />} />
					<Route path="cart" element={<Cart />} />
					<Route path="contact_us" element={<ContactUs />} />
				</Routes>
			</Layout>
		</Router>
	);
};

export default App;
