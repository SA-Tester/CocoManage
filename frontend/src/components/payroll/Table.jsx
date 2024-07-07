import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextInput, Modal } from "flowbite-react";
import jsPDF from "jspdf";
import "jspdf-autotable";


const Table = ({ fetchDashboardData }) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const calculateSalary = async (id, generateReport = false) => {
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

      // Update dashboard total salary paid
      fetchDashboardData();

      //for modal and report
      const displayData = [
        { label: "Employee ID", value: updatedEmployee.employee_id },
        { label: "Employee Name", value: updatedEmployee.name },
        { label: "Worked Days", value: updatedEmployee.worked_days },
        { label: "Basic Salary", value: `Rs. ${updatedEmployee.basic_salary}` },
        {
          label: "Additional Payment",
          value: `Rs. ${updatedEmployee.additional_payment}`,
        },
        { label: "Total Salary", value: `Rs. ${updatedEmployee.total_salary}` },
        { label: "Extra Amount", value: `Rs. ${updatedEmployee.extra_amount}` },
        { label: "E.P.F.", value: `Rs. ${updatedEmployee.epf}` },
        { label: "Cash Advance", value: `Rs. ${updatedEmployee.cash_advance}` },
        {
          label: "Festival Loan",
          value: `Rs. ${updatedEmployee.festival_loan}`,
        },
        {
          label: "Total Deductions",
          value: `Rs. ${updatedEmployee.total_deductions}`,
        },
        { label: "Net Salary", value: `Rs. ${updatedEmployee.net_salary}` },
      ];

      //modal
      if (!generateReport) {
        setModalData(displayData);
        setIsModalOpen(true);
      } else {
        //report
        generateSalaryReport(displayData, updatedEmployee.name);
      }
    } catch (error) {
      console.error("Error calculating salary:", error);
    }
  };

  const generateSalaryReport = (displayData, employee_name) => {
    const doc = new jsPDF();

    // Title
    const title = `Salary Report for ${employee_name}`;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const xOffset = (pageWidth - textWidth) / 2;
    doc.text(title, xOffset, 20);

    const tableBody = displayData.map((item) => [item.label, item.value]);

    doc.autoTable({
      startY: 40,
      head: [["Field", "Value"]],
      body: tableBody,
      theme: "grid",
    });

    const margin = 10;
    doc.setLineWidth(0.5);
    doc.rect(
      margin,
      margin,
      doc.internal.pageSize.getWidth() - margin * 2,
      doc.internal.pageSize.getHeight() - margin * 2
    );

    doc.save(`salary_report_${employee_name}.pdf`);
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
              Festival Loans
            </th>
            <th className="px-4 py-2 text-left text-green font-semibold">
              Cash Advances
            </th>
            <th className="px-4 py-2 text-green font-semibold text-center">
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
              <td className="px-4 py-2 float justify-center">
                <button
                  onClick={() => calculateSalary(item.employee_id)}
                  className="bg-light-green text-white px-4 py-2 ml-10 rounded transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:!bg-green duration-300 ..."
                >
                  Calculate
                </button>
                <button
                  onClick={() => calculateSalary(item.employee_id, true)}
                  className="bg-light-green text-white px-4 py-2 rounded ml-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:!bg-green duration-300 ..."
                >
                  Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalData && (
        <Modal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
        >
          <Modal.Header>
            Salary Details for{" "}
            {modalData.find((item) => item.label === "Employee Name").value}
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {modalData.map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="font-semibold">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="bg-green text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Table;
