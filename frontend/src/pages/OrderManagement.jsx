import React, { useState, useEffect } from "react";
import customerIcon from '../assets/customer-icons.png';
import orderIcon from '../assets/order-icon.png';
import revenueIcon from '../assets/revenue-icon.jpg';
import { ToastContainer, toast } from "react-toastify";
import { Modal, Spinner, Button } from "flowbite-react";
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
    const [selectedOrderReminder, setSelectedOrderReminder] = useState(null);
    const [selectedOrderTotal, setSelectedOrderTotal] = useState(null);
    const [selectedOrderCustomer, setSelectedOrderCustomer] = useState(null);
    const [selectedOrderEmail, setSelectedOrderEmail] = useState(null);
    const [openWaitingModal, setOpenWaitingModal] = useState(false);
    const [openReminder, setReminderModal] = useState(false);

    // Calculate the index range for the current page
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;

    // Slice the filtered data for the current page
    const currentOrders = dataArray.slice(firstIndex, lastIndex);

    // Calculate the total number of pages for pagination
    const nPage = Math.ceil(dataArray.length / recordsPerPage);
    const numbers = [...Array(nPage + 1).keys()].slice(1);

    // useEffect hook to filter orders based on the toggle state and search query
    useEffect(() => {
        let filtered = [];

        if (toggle == 1) {
            // All Orders
            filtered = Object.entries(orderData).map(([key, value]) => Object.entries(value)).flat();
        } else if (toggle == 2) {
            // Completed Orders
            filtered = Object.entries(orderData).map(([key, value]) => Object.entries(value))
                .flat()
                .filter(([subkey, subvalue]) => subvalue.status === 1);
        } else if (toggle == 3) {
            // In Progress Orders
            filtered = Object.entries(orderData).map(([key, value]) => Object.entries(value))
                .flat()
                .filter(([subkey, subvalue]) => subvalue.status === 0);
        } else if (toggle == 4) {
            // Cancelled Orders
            filtered = Object.entries(orderData).map(([key, value]) => Object.entries(value))
                .flat()
                .filter(([subkey, subvalue]) => subvalue.status === 2);
        }

        // Filter data based on the search query
        const searchedData = filtered.filter(([subkey, subvalue]) => {
            return search.toLowerCase() === '' ? subvalue :
                subvalue.name.toLowerCase().includes(search.toLowerCase()) ||
                subvalue.order_id.toString().includes(search) ||
                subvalue.email.toLowerCase().includes(search.toLowerCase());
        });
        // Update the data array and reset the current page
        setDataArray(searchedData);
        setCurrentPage(1);
    }, [search, toggle, orderData]);

    // Function to handle page change for pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    // Function to fetch coconut plant count and unit price from the backend
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

    // Function to fetch dashboard data from the backend
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

    // Function to fetch order data from the backend and update the data array based on the toggle state
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

    // Function to update the toggle state and filter data accordingly
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

    // useEffect hook to fetch initial data when the component mounts
    useEffect(() => {
        get_coconut_plant_count();
        getDashboardData();
        get_order_data();
    }, []);

    // Function to handle the submission of the coconut plant count update form
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

    // Function to handle the submission of the unit price update form
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

    // Function to filter and set the data array to only completed orders
    const filterCompletedOrders = () => {
        const completedOrders = Object.entries(orderData).map(([key, value]) => Object.entries(value))
            .flat()
            .filter(([subkey, subvalue]) => subvalue.status === 1);
        setDataArray(completedOrders);
        setCurrentPage(1);
    };

    // Function to filter and set the data array to only in-progress orders
    const filterInProgressOrders = () => {
        const inProgressOrders = Object.entries(orderData).map(([key, value]) => Object.entries(value))
            .flat()
            .filter(([subkey, subvalue]) => subvalue.status === 0);
        setDataArray(inProgressOrders);
        setCurrentPage(1);
    };

    // Function to filter and set the data array to only cancelled orders
    const filterCancelledOrders = () => {
        const cancelledOrders = Object.entries(orderData).map(([key, value]) => Object.entries(value))
            .flat()
            .filter(([subkey, subvalue]) => subvalue.status === 2);
        setDataArray(cancelledOrders);
        setCurrentPage(1);
    };

    // When click on Change button on a particular order, set that order's details and open model for change status
    const openStatusChangeModal = (orderId, orderDate, orderQuantity, orderEmail, orderTotal, orderCustomer) => {
        setSelectedOrder(orderId);
        setSelectedOrderDate(orderDate);
        setSelectedOrderQuantity(orderQuantity);
        setSelectedOrderTotal(orderTotal);
        setSelectedOrderCustomer(orderCustomer);
        setSelectedOrderEmail(orderEmail)
        setOpenModal(true);
    };

    // Close model of change status and reset details
    const closeStatusChangeModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
        setSelectedOrderDate(null);
        setSelectedOrderQuantity(null);
        setSelectedOrderEmail(null);
        setSelectedOrderTotal(null);
        setSelectedOrderCustomer(null);
    };

    // When click on Reminder button on a particular order, set that order's details and open model for send reminder
    const openSendReminderModal = (orderId, orderDate, orderQuantity, orderEmail, orderTotal, orderCustomer, orderReminder) => {
        setSelectedOrder(orderId);
        setSelectedOrderDate(orderDate);
        setSelectedOrderQuantity(orderQuantity);
        setSelectedOrderTotal(orderTotal);
        setSelectedOrderCustomer(orderCustomer);
        setSelectedOrderEmail(orderEmail);
        setSelectedOrderReminder(orderReminder);
        setReminderModal(true);
    };

    // Close model of send reminder and reset details
    const closeSendReminderModal = () => {
        setReminderModal(false);
        setSelectedOrder(null);
        setSelectedOrderDate(null);
        setSelectedOrderQuantity(null);
        setSelectedOrderEmail(null);
        setSelectedOrderTotal(null);
        setSelectedOrderCustomer(null);
        setSelectedOrderReminder(null);
    };

    // Function to handle the status change form submission and send an email notification to the customer
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        formData.set("order_id", selectedOrder);
        formData.set("quantity", selectedOrderQuantity);
        formData.set("email", selectedOrderEmail);
        formData.set("date", selectedOrderDate);
        formData.set("coconutPlantsCount", plantCount);
        formData.set("total", selectedOrderTotal);
        formData.set("customer_name", selectedOrderCustomer);

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

    // Function to handle the submission of the reminder form and update the reminder status of the order
    const handleSendReminder = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const reminderDate = `${date}/${month}/${year}`;

        formData.set("order_id", selectedOrder);
        formData.set("quantity", selectedOrderQuantity);
        formData.set("email", selectedOrderEmail);
        formData.set("date", selectedOrderDate);
        formData.set("total", selectedOrderTotal);
        formData.set("customer_name", selectedOrderCustomer);
        formData.set("reminder_date", reminderDate);


        axios
            .post("http://localhost:8000/api/send_reminder/", formData)
            .then(() => {
                setOpenWaitingModal(false);
                event.target.reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                toast.success("Reminder sent successfully!");
                closeSendReminderModal();
                get_order_data();
            })
            .catch((error) => {
                setOpenWaitingModal(false);
                toast.error("Failed to send reminder");
                closeSendReminderModal();
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
                    {/* Toggle buttons to switch between order status */}
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
                                        <button className={`${subValue.status == 0 ? "py-2 px-3 text-xs bg-gray-300 text-gray-700 font-medium rounded-md" : "hidden"}`} onClick={() => openStatusChangeModal(subValue.order_id, subValue.date, subValue.quantity, subValue.email, subValue.total, subValue.name)}>Change</button>
                                    </td>
                                    <td>
                                        <button className={`${subValue.status == 0 ? "py-2 px-3 text-xs bg-gray-300 text-gray-800 font-medium rounded-md" : "hidden"}`} onClick={() => openSendReminderModal(subValue.order_id, subValue.date, subValue.quantity, subValue.email, subValue.total, subValue.name, subValue.reminder)}>Reminder</button>
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
            {/* Modals for updating status */}
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
                                    <div className='py-2 px-2 w-full flex flex-row gap-4 align-middle items-center'>
                                        <input type="radio" name="status" id="2" value="2" className="text-green-500 py-2 px-2 rounded-full focus:ring-green-500" />
                                        <label htmlFor="2" className="text-gray-700 w-full">Cancel</label>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 text-center">
                                        Are you sure you want to change status this order?
                                    </h3>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button type="submit" className='bg-green-500 text-white font-semibold w-28 py-3 rounded-xl justify-around' onClick={() => setOpenWaitingModal(true)}>{"Yes, I'm sure"}</button>
                                <button className='bg-gray-200 text-gray-500 font-semibold w-28 py-3 rounded-xl justify-around' onClick={() => closeStatusChangeModal()}>No, cancel</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Modals for showing loading */}
            <Modal className="bg-opacity-70 items-center align-middle lg:pt-56" show={openWaitingModal} size="sm" popup>
                <Modal.Body className="mx-auto">
                    <div className="flex flex-row gap-5">
                        <Spinner color="success" aria-label="Success spinner example" size="lg" />
                        <h3 className="text-lg text-gray-500">Please Wait</h3>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Modals for sending reminders */}
            <Modal className="bg-opacity-70 items-center align-middle lg:pt-36" show={openReminder} size="md" popup onClose={() => closeSendReminderModal()}>
                <Modal.Header />
                <Modal.Body>
                    <div className={`${selectedOrderReminder == "null" ? "space-y-6 text-center" : "hidden"}`}>
                        <form onSubmit={handleSendReminder}>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">
                                Are you sure you want to send this reminder?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <button type="submit" className='bg-green-500 text-white font-semibold w-28 py-3 rounded-xl justify-around' onClick={() => setOpenWaitingModal(true)}>{"Yes, I'm sure"}</button>
                                <button className='bg-gray-200 text-gray-500 font-semibold w-28 py-3 rounded-xl justify-around' onClick={() => closeSendReminderModal()}>No, cancel</button>
                            </div>

                        </form>
                    </div>
                    <div className={`${selectedOrderReminder != "null" ? "space-y-6 text-center" : "hidden"}`}>
                        <h3 className="text-lg font-normal text-gray-500">
                            Reminder already sent on {selectedOrderReminder}.
                        </h3>
                        <button className='bg-green-500 text-white font-semibold w-28 py-3 rounded-xl justify-around' onClick={() => closeSendReminderModal()}>Okay</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default OrderManagement;
