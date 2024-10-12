import React, { useState, useEffect } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import img1 from "../assets/coco.jpg";
import axios from "axios";

const ClientAccount = () => {
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    nic: "",
    position: "",
    contact: "",
    email: "",
  });

  const [activeTab, setActiveTab] = useState("accountDetails");
  const [name, setName] = useState("");
  const [nic, setNic] = useState("");
  const [contact, setContact] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const idToken = localStorage.getItem("idToken");
  //console.log(idToken);

  //fetch details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/profile/",
          {
            idToken,
          }
        );
        const data = response.data;
        setEmployeeDetails(response.data);
        setName(data.name);
        setNic(data.nic);
        setContact(data.contact);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchEmployeeDetails();
  }, []);

  // Clear error and success messages when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccessMessage("");
  };

  // update user details
  const handleUpdateDetails = async (e) => {
    e.preventDefault();

    let data = {
      idToken: idToken,
      name: name,
      nic: nic,
      contact: contact,
    };
    console.log(data);

    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/update_profile/",
        data
      );
      setSuccessMessage(response.data.message);
      setEmployeeDetails({ ...employeeDetails, name, nic, contact });
    } catch (error) {
      setError(error.response.data.message);
      console.error("Error updating employee details:", error);
    }
  };

  //change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    let data = {
      idToken: idToken,
    };
    console.log(data);

    //clear previous error or success messages
    setError("");
    setSuccessMessage("");

    axios
      .post("http://localhost:8000/api/change_password/", data)
      .then((response) => {
        setSuccessMessage(response.data.message);
        console.log(response);
      })
      .catch((error) => {
        setError(error.response.data.message);
        console.error("Error changing password:", error);
      });
  };

  return (
    <React.Fragment>
      <div
        className=" pt-24 pb-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <section className=" mx-40">
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white rounded-lg shadow-lg pt-4 px-2 mb-2 bg-opacity-95">
              <h3 className=" m-4 text-xl font-bold text-primary-600 md:text-2xl">
                Account settings
              </h3>
              <div className="w-full h-10 flex justify-start rounded-lg shadow-sm mb-2">
                <Button
                  className={`text-black bg-white rounded-md shadow-lg uppercase text-md md:text-sm sm:text-sm font-semibold hover:!border-lg hover:!border-green whitespace-nowrap px-4 sm:px-2 ${
                    activeTab === "accountDetails"
                  }`}
                  onClick={() => handleTabChange("accountDetails")}
                >
                  Account Details
                </Button>
                <Button
                  className={`text-black bg-white rounded-md shadow-lg uppercase text-md md:text-sm sm:text-sm font-semibold hover:border-lg hover:!border-green whitespace-nowrap px-4 sm:px-2${
                    activeTab === "changePassword"
                  }`}
                  onClick={() => handleTabChange("changePassword")}
                >
                  Change Password
                </Button>
              </div>

              {/*account details*/}
              {activeTab === "accountDetails" && (
                <div className="mt-4 pb-6">
                  <h3 className=" m-6 text-xl font-bold text-green md:text-xl">
                    Account Details
                  </h3>
                  <form
                    onSubmit={handleUpdateDetails}
                    className="flex max-w-full flex-col gap-4 m-6"
                  >
                    {/*first rown*/}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/*Name*/}
                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label htmlFor="name" value="Name" />
                        </div>
                        <TextInput
                          id="name"
                          name="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          color={"dark"}
                        />
                      </div>
                      {/*NIC*/}
                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label htmlFor="nic" value="NIC" />
                        </div>
                        <TextInput
                          id="nic"
                          name="nic"
                          type="text"
                          value={nic}
                          onChange={(e) => setNic(e.target.value)}
                          color={"dark"}
                        />
                      </div>
                    </div>

                    {/*second rown*/}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/*position*/}
                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label htmlFor="position" value="Position" />
                        </div>
                        <TextInput
                          id="position"
                          name="position"
                          type="text"
                          value={employeeDetails.position}
                          readOnly
                          color={"dark"}
                        />
                      </div>
                      {/*Contact number*/}
                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label htmlFor="contact" value="Contact Number" />
                        </div>
                        <TextInput
                          id="contact"
                          name="contact"
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          color={"dark"}
                        />
                      </div>
                    </div>

                    <div>
                      {/*email*/}
                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label htmlFor="email" value="Email" />
                        </div>
                        <TextInput
                          id="email"
                          name="email"
                          type="email"
                          value={employeeDetails.email}
                          readOnly
                          color={"dark"}
                        />
                      </div>
                    </div>
                    {/* Error and Success Messages */}
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    {successMessage && (
                      <div className="text-green-600 mb-2">
                        {successMessage}
                      </div>
                    )}
                    <section className="flex justify-start mt-4 mb-10">
                      <Button
                        type="submit"
                        className=" rounded-lg bg-green uppercase text-white hover:!bg-light-green"
                      >
                        Change Details
                      </Button>
                    </section>
                  </form>
                </div>
              )}

              {/*change password*/}
              {activeTab === "changePassword" && (
                <div className="mt-4">
                  <h3 className="m-6 text-xl font-bold text-green md:text-xl">
                    Change Password
                  </h3>
                  <form
                    className="flex max-w-full flex-col gap-4 m-6"
                    onSubmit={handleChangePassword}
                  >
                    {/* Error and Success Messages */}
                    {error && <div className="text-red-600 mb-2">{error}</div>}
                    {successMessage && (
                      <div className="text-green-600 mb-2">
                        {successMessage}
                      </div>
                    )}

                    <section className="flex justify-start mt-4 mb-10">
                      <Button
                        type="submit"
                        className=" rounded-lg bg-green uppercase text-white hover:!bg-light-green"
                      >
                        Change Password
                      </Button>
                    </section>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default ClientAccount;
