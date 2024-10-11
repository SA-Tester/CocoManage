import React, { useState, lazy, useEffect } from "react";
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

        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchEmployeeDetails();
  }, []);

  //change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log({
      currentPassword: currentPassword,
      newPassword: newPassword,
      idToken: idToken,
    });

    //clear previous error or success messages
    setError("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setError("Your password should be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Your new passwords do not match with confirm password.");
      return;
    }
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
                  className={`text-black bg-white rounded-md shadow-lg uppercase text-md md:text-sm sm:text-sm font-semibold hover:!border-lg hover:!border-green whitespace-nowrap sm:px-4 sm:px-2 ${
                    activeTab === "accountDetails"
                  }`}
                  onClick={() => setActiveTab("accountDetails")}
                >
                  Account Details
                </Button>
                <Button
                  className={`text-black bg-white rounded-md shadow-lg uppercase text-md md:text-sm sm:text-sm font-semibold hover:border-lg hover:!border-green whitespace-nowrap sm:px-4 sm:px-2${
                    activeTab === "changePassword"
                  }`}
                  onClick={() => setActiveTab("changePassword")}
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
                  <form className="flex max-w-full flex-col gap-4 m-6">
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
                          value={employeeDetails.name}
                          readOnly
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
                          value={employeeDetails.nic}
                          readOnly
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
                          value={employeeDetails.contact}
                          readOnly
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
                    {/*first row*/}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/*current password*/}

                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label
                            htmlFor="current_password"
                            value="Current Password"
                          />
                        </div>
                        <TextInput
                          id="current_password"
                          name="current_password"
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {/*second row*/}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/*new password*/}
                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label htmlFor="new_password" value="New Password" />
                        </div>
                        <TextInput
                          id="new_password"
                          name="new_password"
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      {/*confirm password*/}
                      <div className="mb-6">
                        <div className="mb-2 block">
                          <Label
                            htmlFor="confirm_password"
                            value="Confirm Password"
                          />
                        </div>
                        <TextInput
                          id="confirm_password"
                          name="confirm_password"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <section className="flex justify-end mt-4 mb-10">
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
