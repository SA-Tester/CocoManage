import React, { lazy, useState } from "react";
const Footer = lazy(() => import("../components/common/Footer"));

import customerIcon from '../assets/customer-icons.png';


const ClientAccount = () => {
    const [profile, setProfile] = useState({
        name: "Shiran Perera",
        email: "shiranp@example.com",
        contactNo: "0717869354",
        address: "123 Main St,Kandy road,Kandy"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value
        });
    };

    return (
        <React.Fragment>
            <div className="flex flex-col min-h-screen pt-20">
                {/* Navbar */}

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row justify-center items-start bg-gray-100 p-8 text-black gap-8 flex-grow">
                    <div className='flex flex-col gap-6 w-full lg:w-1/4'>
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
                            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded">Edit</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 w-full lg:w-1/4">
                        <div className="flex flex-col items-center bg-white rounded-lg w-full p-4">
                            <h3 className="font-semibold text-black text-lg">Change Password</h3>
                            <div className="flex flex-col items-start w-full mt-4">
                                <input type="password" placeholder="Old Password" className="mb-2 p-2 border rounded w-full" />
                                <input type="password" placeholder="New Password" className="mb-2 p-2 border rounded w-full" />
                                <input type="password" placeholder="Confirm Password" className="mb-2 p-2 border rounded w-full" />
                            </div>
                            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded">Confirm</button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {/* <Footer /> */}
            </div>
        </React.Fragment>
    );
};

export default ClientAccount;