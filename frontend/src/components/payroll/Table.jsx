import React, { useState } from "react";

const employeeData = [
  {
    id: "EMP001",
    name: "Kasunika Rathnayake",
    role: "Field Officer",
    worked: "21 Days",
    absent: "9 Days",
    salary: "20,000",
    status: "Pending",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    role: "Field Officer",
    worked: "25 Days",
    absent: "5 Days",
    salary: "25,000",
    status: "Paid",
  },
];

const Table = () => {
  const [searchItem, setSearchItem] = useState(""); //search bar input
  const [filterStatus, setFilterStatus] = useState("All"); //status button input

  const filteredData = employeeData.filter((item) => {
    const search = item.id.toLowerCase().includes(searchItem.toLowerCase());

    const status = filterStatus === "All" || item.status === filterStatus;
    return search && status;
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search employee by the ID"
          className="border border-green rounded px-6 py-2 w-full md:w-80 mb-4 md:mb-0 md:mr-4"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              filterStatus === "All"
                ? "bg-green text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setFilterStatus("All")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filterStatus === "Paid"
                ? "bg-green text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setFilterStatus("Paid")}
          >
            Paid
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filterStatus === "Pending"
                ? "bg-green text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setFilterStatus("Pending")}
          >
            Unpaid
          </button>
        </div>
      </div>
      <table className="table-auto min-w-max w-full whitespace-nowrap">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-green font-semibold">
              Employee ID
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Name
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Role
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Worked On
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Absent
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Salary
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {filteredData.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-400 hover:bg-gray-100"
            >
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.role}</td>
              <td className="px-4 py-2">{item.worked}</td>
              <td className="px-4 py-2">{item.absent}</td>
              <td className="px-4 py-2">{item.salary}</td>
              <td className="px-4 py-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
