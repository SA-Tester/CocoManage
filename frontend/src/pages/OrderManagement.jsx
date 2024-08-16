import React, { useState, useEffect } from "react";
import customerIcon from '../assets/customer-icons.png';
import orderIcon from '../assets/order-icon.png';
import revenueIcon from '../assets/revenue-icon.jpg';
import { ToastContainer, toast } from "react-toastify";
import { Modal, Spinner } from "flowbite-react";
import axios from 'axios';

const OrderManagement = () => {
    const [toggle, setToggle] = useState(1)
    const [unitPrice, setUnitPrice] = useState(1);
    const [plantCount, setPlantCount] = useState(1);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [search, setSearch] = useState('');
    const [dataArray, setDataArray] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderDate, setSelectedOrderDate] = useState(null);
    const [selectedOrderQuantity, setSelectedOrderQuantity] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [openWaitingModal, setOpenWaitingModal] = useState(false);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentOrders = dataArray.slice(firstIndex, lastIndex);
    const nPage = Math.ceil(dataArray.length / recordsPerPage);
    const numbers = [...Array(nPage + 1).keys()].slice(1);

    useEffect(() => {
        const filtered = Object.entries(orderData).map(([key, value]) => Object.entries(value)).flat().filter(([subkey, subvalue]) => {
            return search.toLowerCase() === '' ? subvalue :
                subvalue.name.toLowerCase().includes(search) ||
                subvalue.order_id.toLocaleString().includes(search);
        });
        setDataArray(filtered);
        setCurrentPage(1);
    }, [search]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

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

    const getDashboardData = () => {
        axios
            .get("http://localhost:8000/api/get_dashboard_data/")
            .then((response) => {
                setTotalOrder(response.data["total_orders"]);
                setTotalCustomers(response.data["total_customers"]);
                setTotalRevenue(response.data["total_revenue"]);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    function get_order_data() {
        axios
            .get("http://localhost:8000/api/get_order_data/")
            .then((response) => {
                setOrderData(response.data);
                console.log(toggle);
                if (toggle == 1) {
                    const initialDataArray = Object.entries(response.data).map(([key, value]) => Object.entries(value)).flat();
                    setDataArray(initialDataArray);
                } else if (toggle == 2) {
                    const completedOrders = Object.entries(response.data).map(([key, value]) => Object.entries(value))
                        .flat()
                        .filter(([subkey, subvalue]) => subvalue.status === 1);
                    setDataArray(completedOrders);
                } else if (toggle == 3) {
                    const inProgressOrders = Object.entries(response.data).map(([key, value]) => Object.entries(value))
                        .flat()
                        .filter(([subkey, subvalue]) => subvalue.status === 0);
                    setDataArray(inProgressOrders);
                } else if (toggle == 4) {
                    const cancelledOrders = Object.entries(response.data).map(([key, value]) => Object.entries(value))
                        .flat()
                        .filter(([subkey, subvalue]) => subvalue.status === 2);
                    setDataArray(cancelledOrders);
                }
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the order data!",
                    error
                );
            });
    }

    function updateToggle(id) {
        setToggle(id)
        if (id == 1) {
            setDataArray(Object.entries(orderData).map(([key, value]) => Object.entries(value)).flat());
        } else if (id == 2) {
            filterCompletedOrders();
        } else if (id == 3) {
            filterInProgressOrders();
        } else if (id == 4) {
            filterCancelledOrders();
        }
    }

    useEffect(() => {
        get_coconut_plant_count();
        getDashboardData();
        get_order_data();
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

    const filterCompletedOrders = () => {
        const completedOrders = Object.entries(orderData).map(([key, value]) => Object.entries(value))
            .flat()
            .filter(([subkey, subvalue]) => subvalue.status === 1);
        setDataArray(completedOrders);
        setCurrentPage(1);
    };

    const filterInProgressOrders = () => {
        const inProgressOrders = Object.entries(orderData).map(([key, value]) => Object.entries(value))
            .flat()
            .filter(([subkey, subvalue]) => subvalue.status === 0);
        setDataArray(inProgressOrders);
        setCurrentPage(1);
    };

    const filterCancelledOrders = () => {
        const cancelledOrders = Object.entries(orderData).map(([key, value]) => Object.entries(value))
            .flat()
            .filter(([subkey, subvalue]) => subvalue.status === 2);
        setDataArray(cancelledOrders);
        setCurrentPage(1);
    };

    const openStatusChangeModal = (orderId, orderDate, orderQuantity, orderStatus) => {
        setSelectedOrder(orderId);
        setSelectedOrderDate(orderDate);
        setSelectedOrderQuantity(orderQuantity);
        setSelectedOrderStatus(orderStatus);
        setOpenModal(true);
    };

    const closeStatusChangeModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
        setSelectedOrderDate(null);
        setSelectedOrderQuantity(null);
        setSelectedOrderStatus(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        formData.set("order_id", selectedOrder);
        formData.set("quantity", selectedOrderQuantity);
        formData.set("old_status", selectedOrderStatus);
        formData.set("date", selectedOrderDate);
        formData.set("coconutPlantsCount", plantCount);

        axios
            .post("http://localhost:8000/api/update_order_status/", formData)
            .then(() => {
                setOpenWaitingModal(false);
                event.target.reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                toast.success("Successfully Updated!");
                closeStatusChangeModal();
                get_order_data();
                get_coconut_plant_count();
                getDashboardData();
            })
            .catch((error) => {
                setOpenWaitingModal(false);
                toast.error("Error Saving Order Status");
                closeStatusChangeModal();
                console.log(error);
            });
    }

    return (
        <div className="flex flex-col justify-between bg-green lg:flex-col p-8 text-white lg:items-center gap-8 absolute left-0 w-full  max-h-fit">
            <ToastContainer />
            <div className='flex flex-col lg:flex-row gap-6 items-center justify-around w-full mt-5'>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-2/12 p-4">
                    <img src={customerIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Customers</h3>
                    <h1 className="font-bold text-green-400 text-2xl">{totalCustomers}</h1>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-2/12 p-4">
                    <img src={orderIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Orders</h3>
                    <h1 className="font-bold text-green-400 text-2xl">{totalOrder}</h1>
                </div>
                <div className="flex flex-col items-center bg-white rounded-lg w-full lg:w-2/12 p-4">
                    <img src={revenueIcon} alt="" className="w-8" />
                    <h3 className="font-semibold text-black text-lg">Monthly Revenue</h3>
                    <h1 className="font-bold text-green-400 text-2xl">Rs. {totalRevenue !== null ? totalRevenue.toLocaleString() : 0}.00</h1>
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
                            <input type="search" placeholder='Search Order' onChange={(e) => setSearch(e.target.value)} className='w-full p-2 rounded-lg bg-white text-gray-600 placeholder:pl-2 focus:ring-green-500 focus:border-green-500' />
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
                            {currentOrders.map(([subKey, subValue], index) => (
                                <tr key={subValue.order_id} className="bg-white hover:bg-gray-100">
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{subValue.order_id.toString().padStart(7, '0')}</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{subValue.date}</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{subValue.name}</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{subValue.quantity}</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">Rs. {subValue.total.toLocaleString()}.00</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{subValue.phone}</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{subValue.email}</td>
                                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                        <span className={`p-2 text-xs font-medium uppercase tracking-wider rounded-lg bg-opacity-50 ${subValue.status == 0 ? "text-yellow-800 bg-yellow-200" : subValue.status == 1 ? "text-green-800 bg-green-200" : "text-red-800 bg-red-200"}`}>{subValue.status == 0 ? "In Progress" : subValue.status == 1 ? "Completed" : "Cancelled"}</span>
                                    </td>
                                    <td>
                                        <button className="py-2 px-3 text-xs bg-gray-200 text-gray-600 font-medium rounded-md" onClick={() => openStatusChangeModal(subValue.order_id, subValue.date, subValue.quantity, subValue.status)}>Change</button>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex overflow-x-auto sm:justify-center mx-auto">
                    <button className="bg-white text-green-400 px-3 py-2 mx-1 text-sm font-semibold rounded-md" disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
                    {
                        numbers.map(
                            (page) => (<button key={page} onClick={() => handlePageChange(page)} className={page === currentPage ? "bg-green-400 text-white px-3 py-2 mx-1 text-sm font-semibold rounded-md" : "bg-white text-green-400 px-3 py-2 mx-1 text-sm font-semibold rounded-md"}>
                                {page}
                            </button>
                            ))}
                    <button className="bg-white text-green-400 px-3 py-2 mx-1 text-sm font-semibold rounded-md" disabled={currentPage >= nPage} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </div>
            </div>
            <Modal className="bg-opacity-70 items-center align-middle lg:pt-28" show={openModal} size="md" popup onClose={() => closeStatusChangeModal()}>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 text-center">Change Order Status</h3>
                            <div className="max-w-md">
                                <div className="mb-2 block">
                                    <label htmlFor="status" value="Select status" />
                                </div>
                                <div className="border border-gray-400 rounded-md mb-5">
                                    <div className="py-2 px-2 w-full flex flex-row gap-4 align-middle items-center border-b border-b-gray-400">
                                        <input type="radio" name="status" id="1" value="1" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500" defaultChecked />
                                        <label htmlFor="1" className="text-gray-700 w-full">Complete</label>
                                    </div>
                                    <div className='py-2 px-2 w-full flex flex-row gap-4 align-middle items-center border-b border-b-gray-400'>
                                        <input type="radio" name="status" id="2" value="2" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500" />
                                        <label htmlFor="2" className="text-gray-700 w-full">Cancel</label>
                                    </div>
                                    <div className='py-2 px-2 w-full rounded-md flex flex-row gap-4 align-middle items-center'>
                                        <input type="radio" name="status" id="0" value="0" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500" />
                                        <label htmlFor="0" className="text-gray-700 w-full">In Progress</label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className='bg-green-500 text-white font-semibold w-full py-3 rounded-xl justify-around' onClick={() => setOpenWaitingModal(true)}>Save</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal className="bg-opacity-70 items-center align-middle lg:pt-56" show={openWaitingModal} size="sm" popup>
                <Modal.Body className="mx-auto">
                    <div className="flex flex-row gap-5">
                        <Spinner color="success" aria-label="Success spinner example" size="lg" />
                        <h3 className="text-lg text-gray-500">Please Wait</h3>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default OrderManagement;
