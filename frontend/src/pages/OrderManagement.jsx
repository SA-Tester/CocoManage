import React, { useState } from "react";
import { Table, Pagination } from "flowbite-react";
import customerIcon from '../assets/customer-icons.png';
import orderIcon from '../assets/order-icon.png';
import revenueIcon from '../assets/revenue-icon.jpg';
import searchIcon from '../assets/search-icon.png';

const OrderManagement = () => {
    const [toggle, setToggle] = useState(1)

    function updateToggle(id) {
        setToggle(id)
    }

    const [currentPage, setCurrentPage] = useState(1);

    const onPageChange = (page) => setCurrentPage(page);

    return (
        <div className="flex flex-col justify-between bg-green lg:flex-row p-8 text-white lg:items-center gap-8 absolute left-0 w-full  max-h-fit lg:h-full">
            <div className='flex flex-col gap-6 lg:w-1/4 items-center'>
                <div className="flex flex-col items-center bg-white rounded-lg w-full p-4">
                    <img src={customerIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Customers</h3>
                    <h1 className="font-bold text-green-400 text-3xl">25</h1>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full p-4">
                    <img src={orderIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Orders</h3>
                    <h1 className="font-bold text-green-400 text-3xl">30</h1>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full p-4">
                    <img src={revenueIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Monthly Revenue</h3>
                    <h1 className="font-bold text-green-400 text-3xl">Rs. 12,000.00</h1>
                </div>
            </div>
            <div className='flex flex-col gap-6 lg:w-3/4 items-start'>
                <h1 className="font-bold text-white text-4xl">Order History</h1>
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <form className='w-80 relative'>
                        <div className="relative">
                            <input type="search" placeholder='Search' className='w-full p-3 rounded-xl bg-white text-grey-300' />
                            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full">
                                <img src={searchIcon} alt="" className="w-6 opacity-50" />
                            </button>
                        </div>
                    </form>
                    <div className="relative w-[600px] mx-auto h-12 grid grid-cols-4 items-center rounded-xl overflow-hidden bg-white">
                        <button className={toggle === 1 ? "relative block h-12 rounded-xl text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(1)}>
                            All Orders
                        </button>
                        <button className={toggle === 2 ? "relative block h-12 rounded-xl text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(2)}>
                            Completed
                        </button>
                        <button className={toggle === 3 ? "relative block h-12 rounded-xl text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(3)}>
                            In progress
                        </button>
                        <button className={toggle === 4 ? "relative block h-12 rounded-xl text-black bg-green-400" : "bg-white text-grey"} onClick={() => updateToggle(4)}>
                            Canceled
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    <div className={toggle === 1 ? "w-full" : "hidden"}>
                        <Table className="text-center text-sm  rounded-xl">
                            <Table.Head className="bg-white">
                                <Table.HeadCell>OrderID</Table.HeadCell>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Customer</Table.HeadCell>
                                <Table.HeadCell>Quantity</Table.HeadCell>
                                <Table.HeadCell>Tel</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="pt-3 pb-3 bg-white text-black">
                                <Table.Row>
                                    <Table.Cell>0001</Table.Cell>
                                    <Table.Cell>05/05/2024</Table.Cell>
                                    <Table.Cell>Sanjana Ishini</Table.Cell>
                                    <Table.Cell>15</Table.Cell>
                                    <Table.Cell>0711111111</Table.Cell>
                                    <Table.Cell className="bg-green-400 p-1">Completed</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>0002</Table.Cell>
                                    <Table.Cell>07/05/2024</Table.Cell>
                                    <Table.Cell>Shachini Thakshila</Table.Cell>
                                    <Table.Cell>20</Table.Cell>
                                    <Table.Cell>0711245111</Table.Cell>
                                    <Table.Cell className="bg-yellow-400 p-1">In Progress</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>0003</Table.Cell>
                                    <Table.Cell>08/05/2024</Table.Cell>
                                    <Table.Cell>Sewmini Rathnayake</Table.Cell>
                                    <Table.Cell>10</Table.Cell>
                                    <Table.Cell>0711114121</Table.Cell>
                                    <Table.Cell className="bg-yellow-400 p-1">In Progress</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>0004</Table.Cell>
                                    <Table.Cell>09/05/2024</Table.Cell>
                                    <Table.Cell>Kasunika Rathnayake</Table.Cell>
                                    <Table.Cell>05</Table.Cell>
                                    <Table.Cell>0718981111</Table.Cell>
                                    <Table.Cell className="bg-red-400 p-1">Canceled</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                    <div className={toggle === 2 ? "w-full" : "hidden"}>
                        <Table className="text-center text-sm  rounded-xl">
                            <Table.Head className="bg-white">
                                <Table.HeadCell>OrderID</Table.HeadCell>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Customer</Table.HeadCell>
                                <Table.HeadCell>Quantity</Table.HeadCell>
                                <Table.HeadCell>Tel</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="pt-3 pb-3 bg-white text-black">
                                <Table.Row>
                                    <Table.Cell>0001</Table.Cell>
                                    <Table.Cell>05/05/2024</Table.Cell>
                                    <Table.Cell>Sanjana Ishini</Table.Cell>
                                    <Table.Cell>15</Table.Cell>
                                    <Table.Cell>0711111111</Table.Cell>
                                    <Table.Cell className="bg-green-400 p-1">Completed</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                    <div className={toggle === 3 ? "w-full" : "hidden"}>
                        <Table className="text-center text-sm  rounded-xl">
                            <Table.Head className="bg-white">
                                <Table.HeadCell>OrderID</Table.HeadCell>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Customer</Table.HeadCell>
                                <Table.HeadCell>Quantity</Table.HeadCell>
                                <Table.HeadCell>Tel</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="pt-3 pb-3 bg-white text-black">
                                <Table.Row>
                                    <Table.Cell>0002</Table.Cell>
                                    <Table.Cell>07/05/2024</Table.Cell>
                                    <Table.Cell>Shachini Thakshila</Table.Cell>
                                    <Table.Cell>20</Table.Cell>
                                    <Table.Cell>0711245111</Table.Cell>
                                    <Table.Cell className="bg-yellow-400 p-1">In Progress</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>0003</Table.Cell>
                                    <Table.Cell>08/05/2024</Table.Cell>
                                    <Table.Cell>Sewmini Rathnayake</Table.Cell>
                                    <Table.Cell>10</Table.Cell>
                                    <Table.Cell>0711114121</Table.Cell>
                                    <Table.Cell className="bg-yellow-400 p-1">In Progress</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                    <div className={toggle === 4 ? "block w-full" : "hidden"}>
                        <Table className="text-center text-sm  rounded-xl">
                            <Table.Head className="bg-white">
                                <Table.HeadCell>OrderID</Table.HeadCell>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Customer</Table.HeadCell>
                                <Table.HeadCell>Quantity</Table.HeadCell>
                                <Table.HeadCell>Tel</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="pt-3 pb-3 bg-white text-black">
                                <Table.Row>
                                    <Table.Cell>0004</Table.Cell>
                                    <Table.Cell>09/05/2024</Table.Cell>
                                    <Table.Cell>Kasunika Rathnayake</Table.Cell>
                                    <Table.Cell>05</Table.Cell>
                                    <Table.Cell>0718981111</Table.Cell>
                                    <Table.Cell className="bg-red-400 p-1">Canceled</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
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