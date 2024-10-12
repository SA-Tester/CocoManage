import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
	const navigate = useNavigate();

	const signOut = async () => {
		const id_token = localStorage.getItem("idToken");

		try {
			const response = await axios.post("http://localhost:8000/api/signout/", {
				id_token,
			});

			console.log(response.data.message);

			localStorage.removeItem("idToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("accessLevel");

			navigate("/signin");
            
		} catch (error) {
			navigate("/signin");
			console.log(error);
		}
	};

	useEffect(() => {
		signOut();
	}, []);

	return <div>Signing out...</div>;
};

export default SignOut;
