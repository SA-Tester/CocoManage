import React from "react";
import { useLocation } from "react-router-dom";
import Navbar1 from "../components/common/Navbar1";
import Navbar2 from "../components/common/Navbar2";
import Navbar3 from "../components/common/Navbar3";
import Footer from "../components/common/Footer";

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
		if (
			location.pathname === "/" ||
			location.pathname === "/order" ||
			location.pathname === "/contact_us" ||
			location.pathname === "/cart"
		) {
			return <Navbar3 />;
		}
		return <Navbar1 />;
	};
	const renderFooter = () => {
		if (isSignInOrSignUp) {
			return null;
		}
		return <Footer />;
	};

	return (
		<React.Fragment>
			{renderNavbar()}
			<div className="pt-10">
			{children}
			</div>
			{renderFooter()}
		</React.Fragment>
	);
};

export default Layout;
