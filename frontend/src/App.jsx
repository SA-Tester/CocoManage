import { lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";
import Layout from "./pages/Layout.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignOut from "./pages/SignOut.jsx";
import Attendance from "./pages/Attendance.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Order from "./pages/Order.jsx";
import OrderManagement from "./pages/OrderManagement.jsx";
import ClientAccount from "./pages/ClientAccount.jsx";
import StaffDirectory from "./pages/StaffDirectory.jsx";
import Cart from "./pages/Cart.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

const Home = lazy(() => import("../src/pages/Home.jsx"));
const Payroll = lazy(() => import("../src/pages/Payroll.jsx"));
const ContactUs = lazy(() => import("../src/pages/ContactUs.jsx"));

const App = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="order" element={<Order />} />
					<Route path="cart" element={<Cart />} />
					<Route path="contact_us" element={<ContactUs />} />

					<Route path="attendance" element={<Attendance />} />
					<Route path="signin" element={<SignIn />} />
					<Route path="signup" element={<SignUp />} />
					<Route
						path="admin_dashboard"
						element={
							<PrivateRoute>
								<AdminDashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path="order_management"
						element={
							<PrivateRoute>
								<OrderManagement />
							</PrivateRoute>
						}
					/>
					<Route
						path="client_account"
						element={
							<PrivateRoute>
								<ClientAccount />
							</PrivateRoute>
						}
					/>
					<Route
						path="staff_directory"
						element={
							<PrivateRoute requiredAccessLevel="A1">
								<StaffDirectory />
							</PrivateRoute>
						}
					/>
					<Route
						path="payroll"
						element={
							<PrivateRoute requiredAccessLevel="A1">
								<Payroll />
							</PrivateRoute>
						}
					/>

					<Route path="signout" element={<SignOut />} />
					<Route path="unauthorized" element={<Unauthorized />} />
				</Routes>
			</Layout>
		</Router>
	);
};

export default App;
