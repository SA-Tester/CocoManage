import React from "react";
import logo from "../../assets/logo-new.png";

const Footer = () => {
  return (
    <footer className="bg-white p-6 mt-6 md:text-left">
      <div className="mx-auto max-w-screen-xl">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          {/* Address and Logo */}
          <div className="flex flex-col md:items-start md:w-1/2">
            <img
              src={logo}
              alt="logo"
              className="mb-2"
              style={{ width: "180px", height: "auto" }}
            />

            <p className="text-xl font-bold uppercase text-green mb-2">
              Moorock Estate
            </p>
            <p className="text-sm text-black md:text-left">
              Thalgaspitiya, Ambakote,
              <br />
              Mawathagama, Sri Lanka
            </p>
            <p className="text-sm text-black md:text-left mt-2">
              Landline: 0377135676 <br />
              Mobile (Group Manager): 0773050697
            </p>
          </div>
          {/* Google Map */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <iframe
              title="Moorock Estate Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.1250550291606!2d80.4660266735119!3d7.451414511688401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae34719a9c97269%3A0x22b0e4717a4490e8!2sMorok%20Plantation!5e0!3m2!1sen!2slk!4v1717861586297!5m2!1sen!2slk"
              className="h-60 w-full rounded"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <hr className="border-black" />
        {/* Bottom section */}
        <div className="text-center py-4">
          <p className="text-sm text-black">
            Copyright © 2024. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
