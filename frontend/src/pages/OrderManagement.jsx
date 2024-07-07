import React, { useState, useEffect } from "react";
import { Table, Pagination } from "flowbite-react";
import customerIcon from '../assets/customer-icons.png';
import orderIcon from '../assets/order-icon.png';
import revenueIcon from '../assets/revenue-icon.jpg';
import searchIcon from '../assets/search-icon.png';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

const OrderManagement = () => {
    const [toggle, setToggle] = useState(1)
    const [unitPrice, setUnitPrice] = useState(1);
    const [plantCount, setPlantCount] = useState(1);

    function get_coconut_plant_count() {
        axios
            .get("http://localhost:8000/api/get_coconut_plant_count/")
            .then((response) => {
                setPlantCount(response.data["Quantity"]);
                setUnitPrice(response.data["UnitPrice"]);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        get_coconut_plant_count();
    }, []);

    const handleChangePlantCount = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        axios
            .post("http://localhost:8000/api/update_coconut_plants_count/", formData)
            .then(() => {
                toast.success("Successfully Updated!");
                get_coconut_plant_count();
                event.target.reset();
            })
            .catch((error) => {
                toast.error("Error updating");
                console.log(error);
            });
    }

    const handleChangeUnitPrice = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        axios
            .post("http://localhost:8000/api/update_unit_price/", formData)
            .then(() => {
                toast.success("Successfully Updated!");
                get_coconut_plant_count();
                event.target.reset();
            })
            .catch((error) => {
                toast.error("Error updating");
                console.log(error);
            });
    }

    function updateToggle(id) {
        setToggle(id)
    }

    const [currentPage, setCurrentPage] = useState(1);

    const onPageChange = (page) => setCurrentPage(page);

    return (
        <div className="flex flex-col justify-between bg-green lg:flex-col p-8 text-white lg:items-center gap-8 absolute left-0 w-full  max-h-fit">
            <ToastContainer />
            <div className='flex flex-col lg:flex-row gap-6 items-center justify-around w-full mt-5'>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-2/12 p-4">
                    <img src={customerIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Customers</h3>
                    <h1 className="font-bold text-green-400 text-2xl">25</h1>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-2/12 p-4">
                    <img src={orderIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Orders</h3>
                    <h1 className="font-bold text-green-400 text-2xl">30</h1>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-2/12 p-4">
                    <img src={revenueIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Monthly Revenue</h3>
                    <h1 className="font-bold text-green-400 text-2xl">Rs. 12,000.00</h1>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-3/12 p-4">
                    <h3 className="font-semibold text-black text-lg">Remaining Coconut Plants</h3>
                    <form onSubmit={handleChangePlantCount}>
                        <div className="grid grid-cols-3 gap-4 my-2">
                            <input type="text" name="plantCount" placeholder={plantCount} className="border col-span-2 border-gray-400 rounded-md focus:ring-green-500 focus:border-green-500 w-full text-gray-500 text-xl placeholder:text-xl placeholder:font-semibold" required />
                            <button type="submit" className='col-span-1 bg-green-500 text-white font-semibold w-full rounded-md p-2'>Save</button>
                        </div>
                    </form>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-3/12 p-4">
                    <h3 className="font-semibold text-black text-lg">Unit Price</h3>
                    <form onSubmit={handleChangeUnitPrice}>
                        <div className="grid grid-cols-3 gap-4 my-2">
                            <input type="text" name="unitPrice" id="" placeholder={`Rs. ${unitPrice}.00`} className="border col-span-2 border-gray-400 rounded-md focus:ring-green-500 focus:border-green-500 w-full text-gray-500 text-xl placeholder:text-xl placeholder:font-semibold" required />
                            <button type="submit" className='col-span-1 bg-green-500 text-white font-semibold w-full rounded-md p-2'>Save</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='flex flex-col gap-6 w-full items-start'>
                <h1 className="font-bold text-white text-4xl">Order History</h1>
                <div className="flex flex-col lg:flex-row items-center gap-12 justify-between w-full">
                    <form className=' w-full lg:w-1/4'>
                        <div className="relative">
                            <input type="search" placeholder='Search' className='w-full p-2 rounded-lg bg-white text-gray-300 placeholder:pl-2' />
                            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-3 rounded-full">
                                <img src={searchIcon} alt="" className="w-6 opacity-50" />
                            </button>
                        </div>
                    </form>
                    <div className="w-full lg:w-2/4 h-10 grid grid-cols-4 items-center rounded-lg overflow-hidden bg-white text-sm">
                        <button className={toggle === 1 ? "relative block h-10 rounded-lg text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(1)}>
                            All Orders
                        </button>
                        <button className={toggle === 2 ? "relative block h-10 rounded-lg text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(2)}>
                            Completed
                        </button>
                        <button className={toggle === 3 ? "relative block h-10 rounded-lg text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(3)}>
                            In progress
                        </button>
                        <button className={toggle === 4 ? "relative block h-10 rounded-lg text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(4)}>
                            Cancelled
                        </button>
                    </div>
                </div>
                <div className="w-full overflow-x-auto rounded-lg shadow">
                    <div className={toggle === 1 ? "w-full" : "hidden"}>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Order ID</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Date</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Customer Name</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Quantity</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Total</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Telephone No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Email</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">1</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000001</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">05/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Sanjana Ishini</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">15</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 5250.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0711111111</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">sanjana@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">Completed</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">2</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000002</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">07/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Shachini Thakshila</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">20</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 7000.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0711245111</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">shachini@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">In Progress</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">3</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000003</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">08/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Sewmini Rathnayake</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">10</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 3500.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0711114121</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">sewmini@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">In Progress</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">4</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000004</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">09/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Kasunika Rathnayake</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">5</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 1750.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0718981111</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">kasunika@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 rounded-lg bg-opacity-50">Cancelled</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={toggle === 2 ? "w-full" : "hidden"}>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Order ID</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Date</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Customer Name</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Quantity</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Total</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Telephone No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Email</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">1</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000001</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">05/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Sanjana Ishini</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">15</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 5250.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0711111111</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">sanjana@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">Completed</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={toggle === 3 ? "w-full" : "hidden"}>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Order ID</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Date</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Customer Name</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Quantity</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Total</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Telephone No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Email</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">1</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000002</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">07/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Shachini Thakshila</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">20</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 7000.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0711245111</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">shachini@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">In Progress</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">2</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000003</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">08/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Sewmini Rathnayake</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">10</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 3500.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0711114121</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">sewmini@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">In Progress</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={toggle === 4 ? "block w-full" : "hidden"}>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Order ID</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Date</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Customer Name</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Quantity</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Total</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Telephone No.</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Email</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">1</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0000004</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">09/05/2024</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Kasunika Rathnayake</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">5</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. 1750.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">0718981111</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">kasunika@gmail.com</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className="p-2 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 rounded-lg bg-opacity-50">Cancelled</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex overflow-x-auto sm:justify-center mx-auto">
                    <Pagination currentPage={currentPage} totalPages={100} onPageChange={onPageChange} showIcons />
                </div>
            </div>
        </div>
    );
}

export default OrderManagement;