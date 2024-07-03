import React from "react";
import { useLocation } from "react-router-dom";
import Navbar1 from "../components/common/Navbar1";
import Navbar2 from "../components/common/Navbar2";

const Layout = ({ children }) => {
	const location = useLocation();
	const isSignInOrSignUp =
		location.pathname === "/signin" || location.pathname === "/signup";

	return (
		<div>
			{!isSignInOrSignUp && (
				<>{location.pathname === "attendance" ? <Navbar2 /> : <Navbar1 />}</>
			)}
			<div className={isSignInOrSignUp ? "" : "pt-12"}>{children}</div>
		</div>
	);
};

export default Layout;
