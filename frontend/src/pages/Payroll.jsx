import React, { lazy } from "react";
import { Card } from "flowbite-react";
const Navbar = lazy(() => import("../components/navbar/Navbar2"));
const Footer = lazy(() => import("../components/common/Footer"));
const Table = lazy(() => import("../components/payroll/Table"));

const Payroll = () => {
  return (
    <React.Fragment>
      {/* Navbar */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
      </div>
      {/*Main Title*/}
      <section className="bg-green mt-10 p-8">
        <h1 className="text-xl font-bold text-paleCream md:text-2xl xl:text-3xl text-left">
          Payroll Management Dashboard
        </h1>
      </section>

      {/* Overall Pyroll Details Section */}
      <div className="bg-green pt-6 pb-12">
        <section className="px-8 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/*Month*/}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <Card className="h-full max-w-sm mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-green">Month</h3>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-light-green py-4">
                  May
                </h1>
                <p className="text-base text-black">2024</p>
              </div>
            </Card>
          </div>
          {/*Total Employrr*/}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <Card className="h-full max-w-sm mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-green">
                  Total Employee
                </h3>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-light-green py-4">
                  200
                </h1>
                <p className="text-base text-black">Employees</p>
              </div>
            </Card>
          </div>
          {/*Payroll Analysis Graph*/}
          <div className="col-span-1 md:col-span-12 lg:col-span-6">
            <Card className="h-full max-w-full mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-green">
                  Monthly Payroll Analysis
                </h3>
                {/* You can add your graph here */}
              </div>
            </Card>
          </div>
        </section>
      </div>

      {/*Payroll Calculation*/}
      <div className="bg-green p-4 pb-24">
        <div className="bg-white rounded-lg p-4 py-10">
          <Table />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </React.Fragment>
  );
};

export default Payroll;
