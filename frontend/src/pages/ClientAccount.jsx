import React, { useState, lazy, useEffect } from 'react';
import axios from 'axios';
import customerIcon from '../assets/customer-icons.png';

const ClientAccount = () => {
    const [profile, setProfile] = useState({
        user_id: "EMP0001",
        name: "A.M.S.I Attanayake",
        email: "sanjana@gmail.com",
        contactNo: "785264132",
        position: "Manager",
        username: "Sanjana"
    });

    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [showPasswordChange, setShowPasswordChange] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/view_user_profile?user_id=${profile.user_id}`);
                if (response.status === 200) {
                    const data = response.data;
                    setProfile({
                        user_id: profile.user_id,
                        name: data.name,
                        email: data.email,
                        contactNo: data.phone,
                        position: data.position,
                        username: data.username
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };

        fetchProfile();
    }, [profile.user_id]);

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

    const togglePasswordChange = () => {
        setShowPasswordChange(!showPasswordChange);
    };

    const changePassword = () => {
        if (passwords.new_password !== passwords.confirm_password) {
            alert("New password and confirm password do not match");
            return;
        }

        axios.post("/change_user_password/", {
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
                                        readOnly
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
                                        readOnly
                                    />
                                </label>
                                <label className="text-gray-600 w-full mt-2">
                                    <strong>Username:</strong>
                                    <input
                                        type="text"
                                        name="username"
                                        value={profile.username}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded w-full mt-1"
                                        readOnly
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
                                        readOnly
                                    />
                                </label>
                                <label className="text-gray-600 w-full mt-2">
                                    <strong>Position:</strong>
                                    <input
                                        type="text"
                                        name="position"
                                        value={profile.position}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded w-full mt-1"
                                        readOnly
                                    />
                                </label>
                                
                            </div>
                            <button onClick={togglePasswordChange} className="mt-4 bg-green-500 text-white py-2 px-4 rounded">
                                {showPasswordChange ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>
                    </div>

                    {showPasswordChange && (
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
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default ClientAccount;
