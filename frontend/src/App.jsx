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
const Home = lazy(() => import("../src/pages/Home.jsx"));
const Payroll = lazy(() => import("../src/pages/Payroll.jsx"));

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
          <Route path="payroll" element={<Payroll />} />         
				</Routes>
			</Layout>
		</Router>
	);
};

export default App;
