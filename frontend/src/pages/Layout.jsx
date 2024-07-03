import React from "react";
import { useLocation } from "react-router-dom";
import Navbar1 from "../components/common/Navbar1";
import Navbar2 from "../components/common/Navbar2";
import Navbar3 from "../components/common/Navbar3";

const Layout = ({ children }) => {
	const location = useLocation();
	const isSignInOrSignUp =
		location.pathname === "/signin" || location.pathname === "/signup";

	const renderNavbar = () => {
		if (isSignInOrSignUp) {
			return null;
		}
		if (location.pathname === "/attendance") {
			return <Navbar2 />;
		}
		if (location.pathname === "/" || location.pathname === "/order" || location.pathname === "/contact_us") {
			return <Navbar3 />;
		}
		return <Navbar1 />;
	};

	return (
		<div>
			{renderNavbar()}
			<div className={isSignInOrSignUp ? "" : "pt-12"}>{children}</div>
		</div>
	);
};

export default Layout;