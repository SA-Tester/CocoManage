import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
	Table,
	Button,
	Modal,
	Label,
	TextInput,
	FileInput,
	Select,
} from "flowbite-react";

const StaffDirectory = () => {
	// Fetch all the staff members when the page loads
	useEffect(() => {
		getStaff();
	}, []);

	// Variables and functions to get all the staff members
	const [staff, setStaff] = useState([]); // Initialize as an empty array
	const getStaff = () => {
		axios
			.get("http://localhost:8000/api/get_all_employees/")
			.then((response) => {
				const staffData = Object.values(response.data); // Convert the object to an array
				setStaff(staffData);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Variables related to Searching
	const [searchTerm, setSearchTerm] = useState("");

	// Filter staff based on search term
	const filteredStaff =
		searchTerm.trim() === ""
			? staff
			: staff.filter(
					(employee) =>
						employee.name_with_initials
							.toLowerCase()
							.includes(searchTerm.toLowerCase()) ||
						employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						employee.emp_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
						employee.position
							.toLowerCase()
							.includes(searchTerm.toLowerCase()) ||
						employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
						employee.gender.toLowerCase().includes(searchTerm.toLowerCase())
			  );

	useEffect(() => {
		filteredStaff;
	}, [searchTerm]);

	// Variables related to Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [recordsPerPage] = useState(5);
	const lastIndex = currentPage * recordsPerPage;
	const firstIndex = lastIndex - recordsPerPage;
	const currentEmployees = filteredStaff.slice(firstIndex, lastIndex);
	const nPage = Math.ceil(filteredStaff.length / recordsPerPage);
	const numbers = [...Array(nPage + 1).keys()].slice(1);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	// Modals/ Variables and functions related to Add an Employee
	const [newStaff, setNewStaff] = useState({
		name_with_initials: "",
		name: "",
		nic: "",
		position: "Manager",
		email: "",
		phone: "",
		gender: "M",
		photo: "",
	});
	const [showAddModal, setShowAddModal] = useState(false);

	const showAddEmployeeModal = () => {
		setShowAddModal(true);
	};

	// Function to add new staff member
	const handleSubmitNew = (e) => {
		e.preventDefault(); // Prevent form submission from causing a page refresh

		const formData = new FormData();
		formData.append("name_with_initials", newStaff.name_with_initials);
		formData.append("name", newStaff.name);
		formData.append("nic", newStaff.nic);
		formData.append("position", newStaff.position);
		formData.append("email", newStaff.email);
		formData.append("phone", newStaff.phone);
		formData.append("gender", newStaff.gender || "M");
		formData.append("photo", newStaff.photo);

		const confirmAdd = window.confirm(
			"Are you sure you want to add a new employee?"
		);

		if (confirmAdd) {
			axios
				.post("http://localhost:8000/api/add_new_employee/", formData)
				.then((response) => {
					console.log(response);
					toast.success(response.data.message);

					// Reset form fields after successful submission
					setNewStaff({
						emp_id: "",
						photo: "",
						name_with_initials: "",
						name: "",
						nic: "",
						position: "",
						email: "",
						phone: "",
						gender: "",
					});

					getStaff(); // Refresh staff list
					setShowAddModal(false); // Close modal
				})
				.catch((error) => {
					toast.error(
						"Failed to add new employee. Check your data and network connection."
					);
					console.log(error);
				});
		}
	};

	// Modals/ Variables related to Edit (Update) Employee
	const [currentStaff, setCurrentStaff] = useState({});
	const [showEditModal, setShowEditModal] = useState(false);

	const showUpdateEmployeeModal = (staff) => {
		setCurrentStaff(staff);
		setShowEditModal(true);
	};

	// Function to update staff member
	const handleSubmitEdit = (e) => {
		e.preventDefault(); // Prevent form submission from causing a page refresh

		const formData = new FormData();
		formData.append("emp_id", currentStaff.emp_id);
		formData.append("name_with_initials", currentStaff.name_with_initials);
		formData.append("name", currentStaff.name);
		formData.append("nic", currentStaff.nic);
		formData.append("position", currentStaff.position);
		formData.append("email", currentStaff.email);
		formData.append("phone", currentStaff.phone);
		formData.append("gender", currentStaff.gender);
		formData.append("photo", currentStaff.photo); // URL if not uploaded, blob if uploaded new image

		console.log(currentStaff);

		const confirmUpdate = window.confirm(
			"Are you sure you want to update this employee?"
		);
		if (confirmUpdate) {
			axios
				.post("http://localhost:8000/api/update_employee/", formData)
				.then((response) => {
					console.log(response);
					toast.success(response.data.message);

					getStaff(); // Refresh staff list
					setShowEditModal(false); // Close modal
				})
				.catch((error) => {
					toast.error(
						"Failed to update employee. Check your data and network connection."
					);
					console.log(error);
				});
		}
	};

	// Function to delete staff member
	const deleteEmployee = (emp_id) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this employee?"
		);

		if (confirmDelete) {
			axios
				.post("http://localhost:8000/api/delete_employee/", { emp_id: emp_id })
				.then((response) => {
					console.log(response);
					toast.success(response.data.message);

					getStaff(); // Refresh staff list
				})
				.catch((error) => {
					toast.error(
						"Failed to delete employee. Check your data and network connection."
					);
					console.log(error);
				});
		}
	};

	//Modal to Display Image in the Table
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const openImageModal = (imageUrl) => {
		setSelectedImage(imageUrl);
		setIsImageModalOpen(true);
	};

	const closeImageModal = () => {
		setIsImageModalOpen(false);
		setSelectedImage(null);
	};

	return (
		<div className="flex flex-col justify-between bg-green lg:flex-row p-8 text-white lg:items-center gap-8 absolute left-0 w-full">
			{/* Rendering the Toast Container for Notifications */}
			<ToastContainer />

			<div className="flex flex-col gap-6 w-full lg:w-3/4 items-start mx-auto">
				<h1 className="font-bold text-white text-4xl pt-8">Staff Directory</h1>
				<div className="flex flex-row items-center gap-12">
					<div className="relative">
						<TextInput
							type="search"
							placeholder="Search"
							className="w-full rounded-xl bg-white text-black"
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<button
						onClick={showAddEmployeeModal}
						className="flex items-center bg-blue-500 text-white p-3 rounded-lg"
					>
						Add Staff Member
					</button>
				</div>
				<div className="w-full mt-6">
					<Table className="text-center text-sm rounded-xl">
						<Table.Head className="bg-white">
							<Table.HeadCell>Photo</Table.HeadCell>
							<Table.HeadCell>Employee ID</Table.HeadCell>
							<Table.HeadCell>Name with Initials</Table.HeadCell>
							<Table.HeadCell>Full Name</Table.HeadCell>
							<Table.HeadCell>NIC</Table.HeadCell>
							<Table.HeadCell>Position</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Phone</Table.HeadCell>
							<Table.HeadCell>Gender</Table.HeadCell>
							<Table.HeadCell>Action</Table.HeadCell>
						</Table.Head>
						<Table.Body className="bg-white text-black">
							{currentEmployees.map((employee) => (
								<Table.Row
									key={employee.emp_id}
									className="bg-gray-50 hover:bg-gray-100"
								>
									<Table.Cell>
										<div className="flex justify-center items-center">
											<img
												src={employee.photo}
												className="cursor-pointer w-32 h-30 rounded-md"
												onClick={() => openImageModal(employee.photo)}
												alt="Employee"
											/>
										</div>

										<Modal
											show={isImageModalOpen}
											size="xl"
											popup
											onClose={closeImageModal}
										>
											<Modal.Body>
												<div className="flex justify-center items-center">
													<img
														src={selectedImage}
														className="w-full h-auto object-cover rounded-md"
														alt="Employee Modal"
													/>
												</div>
											</Modal.Body>
											<Modal.Footer>
												<Button
													onClick={closeImageModal}
													className="bg-red-500 text-white p-2 rounded-lg"
												>
													Close
												</Button>
											</Modal.Footer>
										</Modal>
									</Table.Cell>
									<Table.Cell>{employee.emp_id}</Table.Cell>
									<Table.Cell>{employee.name_with_initials}</Table.Cell>
									<Table.Cell>{employee.name}</Table.Cell>
									<Table.Cell>{employee.nic}</Table.Cell>
									<Table.Cell>{employee.position}</Table.Cell>
									<Table.Cell>{employee.email}</Table.Cell>
									<Table.Cell>{employee.phone}</Table.Cell>
									<Table.Cell>{employee.gender}</Table.Cell>
									<Table.Cell>
										<div className="flex items-center gap-2">
											<button
												onClick={() => showUpdateEmployeeModal(employee)}
												className="bg-green-500 text-white p-2 rounded-lg"
											>
												Edit
											</button>
											<button
												className="bg-red-500 text-white p-2 rounded-lg"
												onClick={() => deleteEmployee(employee.emp_id)}
											>
												Delete
											</button>
										</div>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</div>
				<div className="flex overflow-x-auto sm:justify-center mx-auto">
					<button
						className="bg-white text-green-400 px-3 py-2 mx-1 text-sm font-semibold rounded-md"
						disabled={currentPage <= 1}
						onClick={() => handlePageChange(currentPage - 1)}
					>
						Prev
					</button>
					{numbers.map((page) => (
						<button
							key={page}
							onClick={() => handlePageChange(page)}
							className={
								page === currentPage
									? "bg-green-400 text-white px-3 py-2 mx-1 text-sm font-semibold rounded-md"
									: "bg-white text-green-400 px-3 py-2 mx-1 text-sm font-semibold rounded-md"
							}
						>
							{page}
						</button>
					))}
					<button
						className="bg-white text-green-400 px-3 py-2 mx-1 text-sm font-semibold rounded-md"
						disabled={currentPage >= nPage}
						onClick={() => handlePageChange(currentPage + 1)}
					>
						Next
					</button>
				</div>
			</div>

			{/* Modal for adding new staff */}
			<Modal
				show={showAddModal}
				size="4xl"
				popup
				onClose={() => setShowAddModal(false)}
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6">
						<h3 className="text-xl font-medium text-gray-900">
							Add New Staff Member
						</h3>
						<form
							onSubmit={(e) => handleSubmitNew(e)}
							className="space-y-6"
							encType="multipart/form-data"
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<Label
										htmlFor="name_with_initials"
										value="Name with Initials"
									/>
									<TextInput
										id="name_with_initials"
										name="name_with_initials"
										type="text"
										value={newStaff.name_with_initials}
										onChange={(e) =>
											setNewStaff({
												...newStaff,
												name_with_initials: e.target.value,
											})
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="name" value="Full Name" />
									<TextInput
										id="name"
										name="full_name"
										type="text"
										value={newStaff.name}
										onChange={(e) =>
											setNewStaff({ ...newStaff, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="nic" value="National Identity Card Number" />
									<TextInput
										id="nic"
										name="nic"
										type="text"
										value={newStaff.nic}
										onChange={(e) =>
											setNewStaff({ ...newStaff, nic: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="position" value="Position" />
									<Select
										id="position"
										name="position"
										value={newStaff.position}
										onChange={(e) =>
											setNewStaff({ ...newStaff, position: e.target.value })
										}
										required
									>
										<option value="Manager">Manager</option>
										<option value="Assistant Manager">Assistant Manager</option>
										<option value="Labourer">Labourer</option>
									</Select>
								</div>
								<div>
									<Label htmlFor="email" value="Email" />
									<TextInput
										id="email"
										name="email"
										type="email"
										value={newStaff.email}
										onChange={(e) =>
											setNewStaff({ ...newStaff, email: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor="phone" value="Phone" />
									<TextInput
										id="phone"
										name="phone"
										type="tel"
										value={newStaff.phone}
										onChange={(e) =>
											setNewStaff({ ...newStaff, phone: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="gender" value="Gender" />
									<Select
										id="gender"
										name="gender"
										value={newStaff.gender}
										onChange={(e) =>
											setNewStaff({ ...newStaff, gender: e.target.value })
										}
										required
									>
										<option value="M">Male</option>
										<option value="F">Female</option>
									</Select>
								</div>
								<div>
									<Label htmlFor="photo" value="Photo" />
									<FileInput
										id="photo"
										name="photo"
										onChange={(e) =>
											setNewStaff({ ...newStaff, photo: e.target.files[0] })
										}
										required
									/>
								</div>
							</div>
							<div className="flex flex-row gap-4">
								<Button
									type="submit"
									color="green"
									onClick={(e) => handleSubmitNew(e)}
								>
									Add Employee
								</Button>
								<Button color="gray" onClick={() => setShowAddModal(false)}>
									Cancel
								</Button>
							</div>
						</form>
					</div>
				</Modal.Body>
			</Modal>

			{/* Modal for editing staff */}
			<Modal
				show={showEditModal}
				size="4xl"
				popup
				onClose={() => setShowEditModal(false)}
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6">
						<h3 className="text-xl font-medium text-gray-900">
							Edit Staff Member
						</h3>
						<div className="flex justify-center items-center">
							<img
								src={currentStaff.photo}
								alt=""
								className="w-48 h-46 rounded-md"
							/>
						</div>
						<form
							onSubmit={(e) => handleSubmitEdit(e)}
							className="space-y-6"
							encType="multipart/form-data"
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<Label htmlFor="emp_id" value="Employee ID" />
									<TextInput
										id="emp_id"
										name="emp_id"
										type="text"
										defaultValue={currentStaff.emp_id}
										readOnly={true}
									/>
								</div>
								<div>
									<Label
										htmlFor="name_with_initials"
										value="Name with Initials"
									/>
									<TextInput
										id="name_with_initials"
										name="name_with_initials"
										type="text"
										defaultValue={currentStaff.name_with_initials}
										onChange={(e) =>
											setCurrentStaff({
												...currentStaff,
												name_with_initials: e.target.value,
											})
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="name" value="Full Name" />
									<TextInput
										id="name"
										name="full_name"
										type="text"
										defaultValue={currentStaff.name}
										onChange={(e) =>
											setCurrentStaff({ ...currentStaff, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="nic" value="National Identity Card Number" />
									<TextInput
										id="nic"
										name="nic"
										type="text"
										defaultValue={currentStaff.nic}
										onChange={(e) =>
											setCurrentStaff({ ...currentStaff, nic: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="position" value="Position" />
									<Select
										id="position"
										name="position"
										defaultValue={currentStaff.position}
										onChange={(e) =>
											setCurrentStaff({
												...currentStaff,
												position: e.target.value,
											})
										}
										required
									>
										<option value="Manager">Manager</option>
										<option value="Assistant Manager">Assistant Manager</option>
										<option value="Labourer">Labourer</option>
									</Select>
								</div>
								<div>
									<Label htmlFor="email" value="Email" />
									<TextInput
										id="email"
										name="email"
										type="email"
										defaultValue={currentStaff.email}
										onChange={(e) =>
											setCurrentStaff({
												...currentStaff,
												email: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<Label htmlFor="phone" value="Phone" />
									<TextInput
										id="phone"
										name="phone"
										type="tel"
										defaultValue={currentStaff.phone}
										onChange={(e) =>
											setCurrentStaff({
												...currentStaff,
												phone: e.target.value,
											})
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="gender" value="Gender" />
									<Select
										id="gender"
										name="gender"
										defaultValue={currentStaff.gender}
										onChange={(e) =>
											setCurrentStaff({
												...currentStaff,
												gender: e.target.value,
											})
										}
										required
									>
										<option value="M">Male</option>
										<option value="F">Female</option>
									</Select>
								</div>
								<div>
									<Label htmlFor="photo" value="Photo" />
									<FileInput
										id="photo"
										name="photo"
										onChange={(e) =>
											setCurrentStaff({
												...currentStaff,
												photo: e.target.files[0],
											})
										}
									/>
								</div>
							</div>
							<div className="flex flex-row gap-4">
								<Button
									type="submit"
									color="green"
									onClick={(e) => handleSubmitEdit(e)}
								>
									Update Employee
								</Button>
								<Button color="gray" onClick={(w) => setShowEditModal(false)}>
									Cancel
								</Button>
							</div>
						</form>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default StaffDirectory;
