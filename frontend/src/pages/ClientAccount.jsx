import React, { useState, lazy, useEffect } from 'react';

const Navbar = lazy(() => import("../components/common/Navbar2"));
const Footer = lazy(() => import("../components/common/Footer"));

import customerIcon from '../assets/customer-icons.png';

import axios from 'axios';

const ClientAccount = () => {
    const [profile, setProfile] = useState({
        user_id: "1",
        name: "Shiran Perera",
        email: "shiranp@example.com",
        contactNo: "0717869354",
        address: "123 Main St,Kandy road,Kandy"
    });

    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
    };

    const updateProfile = () => {
        axios.post("/api/update_profile/", profile)
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const changePassword = () => {
        if (passwords.new_password !== passwords.confirm_password) {
            alert("New password and confirm password do not match");
            return;
        }

        axios.post("/api/change_password/", {
            user_id: profile.user_id,
            old_password: passwords.old_password,
            new_password: passwords.new_password
        })
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                console.error(error);
            });
    };


    return (
        <React.Fragment>
            <div className="flex flex-col min-h-screen">
                {/* Navbar */}

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row justify-center items-start bg-gray-200 p-8 text-black gap-8 flex-grow" style={{ marginTop: '25px' }}>
                    <div className='flex flex-col gap-6 w-full lg:w-1/4' style={{ marginRight: '100px' }}>
                        <div className="flex flex-col items-center bg-white rounded-lg w-full p-4">
                            <img src={customerIcon} alt="User Icon" className="w-16" />
                            <h3 className="font-semibold text-black text-lg">Profile</h3>
                            <div className="flex flex-col items-start w-full mt-4">
                                <label className="text-gray-600 w-full">
                                    <strong>Name:</strong>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded w-full mt-1"
                                    />
                                </label>
                                <label className="text-gray-600 w-full mt-2">
                                    <strong>Email:</strong>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded w-full mt-1"
                                    />
                                </label>
                                <label className="text-gray-600 w-full mt-2">
                                    <strong>Contact No:</strong>
                                    <input
                                        type="text"
                                        name="contactNo"
                                        value={profile.contactNo}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded w-full mt-1"
                                    />
                                </label>
                                <label className="text-gray-600 w-full mt-2">
                                    <strong>Address:</strong>
                                    <input
                                        type="text"
                                        name="address"
                                        value={profile.address}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded w-full mt-1"
                                    />
                                </label>
                            </div>
                            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded" onClick={updateProfile}>Edit</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 w-full lg:w-1/4">
                        <div className="flex flex-col items-center bg-white rounded-lg w-full p-4">
                            <h3 className="font-semibold text-black text-lg">Change Password</h3>
                            <div className="flex flex-col items-start w-full mt-4">
                                <input 
                                    type="password"
                                    name="old_password"
                                    value={passwords.old_password}
                                    onChange={handlePasswordChange}
                                    placeholder="Old Password"
                                    className="mb-2 p-2 border rounded w-full"/>

                                <input 
                                    type="password"
                                    name="new_password"
                                    value={passwords.new_password}
                                    onChange={handlePasswordChange}
                                    placeholder="New Password"
                                    className="mb-2 p-2 border rounded w-full"
                                />

                                <input 
                                    type="password"
                                    name="confirm_password"
                                    value={passwords.confirm_password}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm Password"
                                    className="mb-2 p-2 border rounded w-full"
                                />

                            </div>
                            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded" onClick={changePassword}>Confirm</button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default ClientAccount;