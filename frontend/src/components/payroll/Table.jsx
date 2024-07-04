import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextInput } from "flowbite-react";

const Table = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/employee_data/"
        );
        console.log(response.data);
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) =>
      prevData.map((item) =>
        item.employee_id === id ? { ...item, [name]: value } : item
      )
    );
  };

  const calculateSalary = async (id) => {
    const employee = employeeData.find((item) => item.employee_id === id);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/calculate_salary/",
        {
          employee_id: id,
          cash_advance: employee.cash_advance,
          festival_loan: employee.festival_loan,
        }
      );
      console.log(response.data);
      const updatedEmployee = response.data;
      setEmployeeData((prevData) =>
        prevData.map((item) =>
          item.employee_id === id ? { ...item, ...updatedEmployee } : item
        )
      );
    } catch (error) {
      console.error("Error calculating salary:", error);
    }
  };

  //filter based on employee id
  const filteredData = Array.isArray(employeeData)
    ? employeeData.filter((item) =>
        item.employee_id.toLowerCase().includes(searchItem.toLowerCase())
      )
    : [];

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
              Worked Days
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Basic Salary
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Additional Payment
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Total Salary
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Extra Amount
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              E.P.F
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Festival Loans
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Cash Advances
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Total Deductions
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Net Salary
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {filteredData.map((item) => (
            <tr
              key={item.employee_id}
              className="border-b border-gray-400 hover:bg-gray-100"
            >
              <td className="px-4 py-2 font-bold">{item.employee_id}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2 text-center">{item.worked_days}</td>
              <td className="px-4 py-2 text-center">{item.basic_salary}</td>
              <td className="px-4 py-2 text-center">
                {item.additional_payment}
              </td>
              <td className="px-4 py-2 text-center">{item.total_salary}</td>
              <td className="px-4 py-2 text-center">{item.extra_amount}</td>
              <td className="px-4 py-2 text-center">{item.epf}</td>
              <td className="px-4 py-2">
                <TextInput
                  id="festival_loan"
                  name="festival_loan"
                  type="number"
                  required
                  value={item.festival_loan || ""}
                  onChange={(e) => handleInputChange(e, item.employee_id)}
                />
              </td>
              <td className="px-4 py-2">
                <TextInput
                  id="cash_advance"
                  name="cash_advance"
                  type="number"
                  required
                  value={item.cash_advance || ""}
                  onChange={(e) => handleInputChange(e, item.employee_id)}
                />
              </td>
              <td className="px-4 py-2 text-center">{item.total_deductions}</td>
              <td className="px-4 py-2 text-center font-extrabold">
                {item.net_salary}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => calculateSalary(item.employee_id)}
                  className="bg-light-green text-white px-4 py-2 rounded"
                >
                  Calculate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
