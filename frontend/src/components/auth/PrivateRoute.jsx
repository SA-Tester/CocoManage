import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children, requiredAccessLevel }) => {
	const idToken = localStorage.getItem("idToken");
	const refreshToken = localStorage.getItem("refreshToken");
	const userAccessLevel = localStorage.getItem("accessLevel");
	const navigate = useNavigate();

	const isAuthenticated = async () => {
		try {
			const response = await axios.post(
				"http://localhost:8000/api/refresh_token/",
				{
					id_token: idToken,
					refresh_token: refreshToken,
				}
			);

			console.log(response.data.message);
			localStorage.setItem("idToken", response.data.id_token);
			return true;

		} catch (error) {
			console.log(error);
			return false;
		}
	};

	useEffect(() => {
		const checkAuthentication = async () => {
			const authenticated = await isAuthenticated();
			if (!authenticated) {
				navigate("/signin");
			} 
			else if (
				requiredAccessLevel &&
				userAccessLevel !== requiredAccessLevel
			) {
				navigate("/unauthorized");
			}
		};
		checkAuthentication();
	}, [navigate]);

	return (
		children
	);
};

export default PrivateRoute;
