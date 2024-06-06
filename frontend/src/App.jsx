import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Attendance from "./pages/Attendance.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Order from "./pages/Order.jsx";

const App = () => {
	return (
		// <div>
		//   <HelloWorld />
		// </div>

		<Router>
			<Layout>
				<Routes>
					<Route index element={<Attendance />} />
					<Route path="signin" element={<SignIn />} />
					<Route path="signup" element={<SignUp />} />
					{/* <Route index element={<AdminDashboard />} /> */}
					<Route path="admin_dashboard" element={<AdminDashboard />} />
					<Route path="order" element={<Order />} />
				</Routes>
			</Layout>
		</Router>
	);
};

export default App;
