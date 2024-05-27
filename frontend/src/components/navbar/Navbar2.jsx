import React from "react";
import logo from "../../assets/logo.png";

const Navbar2 = () => {
  return (
    <nav className="bg-badge text-black fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-bold">
          <img src={logo} alt="Logo" width="40%" height="30%" />
        </div>

        <div className="space-x-4">
          <a
            href="#home"
            className="bg-white py-3 px-3 rounded-md outline outline-black hover:bg-light-grey"
          >
            Sign In
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
