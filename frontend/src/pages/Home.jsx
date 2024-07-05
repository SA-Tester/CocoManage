import React, { lazy, useEffect } from "react";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
const Navbar = lazy(() => import("../components/common/Navbar2"));
const Footer = lazy(() => import("../components/common/Footer"));
import img1 from "../assets/image1.jpg";
import img2 from "../assets/History.jpg";
import img3 from "../assets/About-us.jpg";
import "aos/dist/aos.css";
import AOS from "aos";

const home = () => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate("/order");
  };

  useEffect(() => {
    AOS.init({
      duration: 2500,
      once: true,
    });
  }, []);

  return (
    <React.Fragment>
      {/* Hero Section */}
      <div className="flex w-full flex-col sm:pt-3 md:pt-4 lg:pt-8">
        <section className="grid grid-cols-12 bg-green">
          {/* Content Section */}
          <div className="p-6 lg:mt-20 lg:pt-20 col-span-12 md:col-span-6 lg:col-span-7">
            <h1 className="text-xl font-bold text-paleCream md:text-2xl xl:text-3xl text-left">
              Join us for Moorock Coconut's
              <br /> Freshness and Flavor
            </h1>

            <p className="max-w-2xl text-sm md:text-lg mt-7 text-white">
              Become a part of our community and discover the wonders of
              premium-quality coconuts, sourced directly from nature's bounty.
            </p>

            <Button
              size={"xs"}
              className="md:w-full mt-7 rounded-lg bg-white font-bold border-green uppercase  text-green transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:!bg-paleCream duration-300 ...  flex items-center"
              style={{ height: "40px", width: "100px" }}
              onClick={handleOrderClick}
            >
              Order Now
            </Button>
          </div>
          {/* Image Section */}
          <div className="flex-1 col-span-12 md:col-span-6 lg:col-span-5">
            <img
              src={img1}
              alt="Coconut Estate Image"
              className="w-full h-auto"
            />
          </div>
        </section>
      </div>

      {/* About Us Section */}
      <div className="bg-white py-8">
        {/* About Us */}
        <section className="p-12 grid grid-cols-12 md:space-x-10 overflow-hidden">
          <div
            className="col-span-12 md:col-span-6  lg:col-span-5 "
            data-aos="fade-right"
          >
            <img
              src={img3}
              alt="Moroock Estate Image"
              className="w-full h-auto"
            />
          </div>
          <div
            className="col-span-12 md:col-span-6 lg:col-span-7"
            data-aos="fade-left"
          >
            <h1 className="text-xl font-bold text-green md:text-2xl xl:text-3xl border-b-2 border-green pb-3">
              About Us
            </h1>
            <p className="max-w-2xl text-sm md:text-lg mt-5 text-black">
              <span className="font-bold">Location</span>: Kurunegala, Sri Lanka
              <br />
              <span className="font-bold">District:</span> Kurunegala
              <br />
              <span className="font-bold">Established:</span> 1904
            </p>

            <p className="max-w-2xl text-sm md:text-lg mt-5 text-black">
              Welcome to Moorock State, a historic coconut estate nestled in the
              scenic landscape of Kurunegala, Sri Lanka. For over a century,
              Moorock State has been renowned for cultivating premium coconuts,
              embodying a tradition of excellence and sustainability. The
              Moorock variety, carefully nurtured within our estate, is prized
              for its distinct flavor profile and versatility in culinary
              applications. Whether enjoyed fresh or used in traditional Sri
              Lankan dishes, Moorock coconuts offer a truly unique gastronomic
              experience.
            </p>
          </div>
        </section>
      </div>

      {/* History Section */}
      <div className="bg-green py-8">
        <section className="p-12 grid grid-cols-12 md:space-x-10 overflow-hidden">
          <div
            className="col-span-12 md:col-span-6 lg:col-span-7"
            data-aos="fade-right"
          >
            <h1 className="text-xl font-bold text-badge md:text-2xl xl:text-3xl border-b border-badge pb-3">
              Legacy of Moorock Estate
            </h1>
            <p className="max-w-2xl text-sm md:text-lg mt-5 text-white">
              Moorock Estate has been shaped by dedicated individuals over the
              years. From A. W. Warburton Gray's management during 1914-1922 to
              E. Scott's tenure as manager from 1905 to 1912, each leader
              contributed their unique touch. Edward G. W. Scott started as an
              assistant manager in 1904, while Jardine W. briefly managed in the
              same year. Behind it all, H. W. Bajley owned and oversaw the
              estate from 1904 to 1922, setting the foundation for Moorock's
              enduring legacy.
            </p>
          </div>
          <div
            className="col-span-12 md:col-span-6 lg:col-span-5"
            data-aos="fade-left"
          >
            <img
              src={img2}
              alt="Coconut Plant Image"
              className="w-full h-auto"
            />
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default home;
