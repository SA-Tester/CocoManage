import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	Pagination,
	Button,
	Modal,
	Label,
	TextInput,
	FileInput,
	Select,
} from "flowbite-react";
import searchIcon from "../assets/search-icon.png";

const StaffDirectory = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [staff, setStaff] = useState([]); // Initialize as an empty array

	useEffect(() => {
		getStaff();
	}, []);

	const getStaff = () => {
		axios
			.get("http://localhost:8000/api/get_all_employees/")
			.then((response) => {
				const staffData = Object.values(response.data); // Convert the object to an array
				setStaff(staffData);
				console.log(staffData);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [staffPerPage] = useState(10);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [newStaff, setNewStaff] = useState({
		photo: "",
		name_with_initials: "",
		name: "",
		nic: "",
		position: "",
		email: "",
		phone: "",
		gender: "",
	});

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleAddStaff = () => {
		setShowAddModal(true);
	};

	const handleEditStaff = (staff) => {
		setCurrentStaff(staff);
		setShowEditModal(true);
	};

	const handleSubmitNew = () => {
		setShowAddModal(false);
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
	};

	const handleSubmitEdit = () => {
		const updatedStaff = staff.map((employee) =>
			employee.emp_id === currentStaff.emp_id ? currentStaff : employee
		);
		setStaff(updatedStaff);
		setShowEditModal(false);
	};

	const filteredStaff = staff.filter(
		(employee) =>
			employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
			employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			employee.phone.includes(searchTerm)
	);

	const indexOfLastStaff = currentPage * staffPerPage;
	const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
	const currentStaffPage = filteredStaff.slice(
		indexOfFirstStaff,
		indexOfLastStaff
	);

	const onPageChange = (page) => setCurrentPage(page);

	return (
		<div className="flex flex-col justify-between bg-green lg:flex-row p-8 text-white lg:items-center gap-8 absolute left-0 w-full h-full">
			<div className="flex flex-col gap-6 w-full lg:w-3/4 items-start mx-auto">
				<h1 className="font-bold text-white text-4xl">Staff Directory</h1>
				<div className="flex flex-row items-center gap-12">
					<form className="w-80 relative">
						<div className="relative">
							<input
								type="search"
								placeholder="Search"
								value={searchTerm}
								onChange={handleSearch}
								className="w-full p-3 rounded-xl bg-white text-grey-300"
							/>
							<button
								type="button"
								className="absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full"
							>
								<img src={searchIcon} alt="" className="w-6 opacity-50" />
							</button>
						</div>
					</form>
					<button
						onClick={handleAddStaff}
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
						<Table.Body className="pt-3 pb-3 bg-white text-black">
							{currentStaffPage.map((employee) => (
								<Table.Row key={employee.emp_id}>
									<Table.Cell>
										<img src={employee.photo} alt="" className="w-48 h-20" />
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
										<div className="flex items-center">
											<button
												onClick={() => handleEditStaff(employee)}
												className="bg-green-500 text-white p-2 rounded-lg"
											>
												Edit
											</button>
											<button
												onClick={() => handleEditStaff(employee)}
												className="bg-red-500 text-white p-2 rounded-lg"
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
						<form onSubmit={handleSubmitNew} className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<Label
										htmlFor="name_with_initials"
										value="Name with Initials"
									/>
									<TextInput
										id="name_with_initials"
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
										value={newStaff.position}
										onChange={(e) =>
											setNewStaff({ ...newStaff, position: e.target.value })
										}
										required
									>
										<option value="manager">Manager</option>
										<option value="asst. manager">Assistant Manager</option>
										<option value="labourer">Labourer</option>
									</Select>
								</div>
								<div>
									<Label htmlFor="email" value="Email" />
									<TextInput
										id="email"
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
										value={newStaff.gender}
										onChange={(e) =>
											setNewStaff({ ...newStaff, gender: e.target.value })
										}
										required
									>
										<option value="male">Male</option>
										<option value="female">Female</option>
									</Select>
								</div>
								<div>
									<Label htmlFor="photo" value="Photo" />
									<FileInput
										id="photo"
										onChange={(e) =>
											setNewStaff({ ...newStaff, photo: e.target.files[0] })
										}
										required
									/>
								</div>
							</div>
							{/* Submit Button */}
							{/* <div className="flex justify-start">
								<Button color="green" onClick={() => setShowAddModal(false)}>
									Add Employee
								</Button>
							</div> */}
						</form>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button color="green" onClick={() => setShowAddModal(false)}>
						Add Employee
					</Button>
					<Button color="gray" onClick={() => setShowAddModal(false)}>
						Cancel
					</Button>
				</Modal.Footer>
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
						<div>
							<Label htmlFor="name" value="Name" />
							<TextInput
								id="name"
								type="text"
								value={currentStaff.name}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, name: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="position" value="Position" />
							<TextInput
								id="position"
								type="text"
								value={currentStaff.position}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, position: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="email" value="Email" />
							<TextInput
								id="email"
								type="email"
								value={currentStaff.email}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, email: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="phone" value="Phone" />
							<TextInput
								id="phone"
								type="tel"
								value={currentStaff.phone}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, phone: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="gender" value="Gender" />
							<Select
								id="gender"
								value={currentStaff.gender}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, gender: e.target.value })
								}
								required
							>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</Select>
						</div>
						<div>
							<Label htmlFor="photo" value="Photo" />
							<FileInput
								id="photo"
								onChange={(e) =>
									setCurrentStaff({
										...currentStaff,
										photo: e.target.files[0],
									})
								}
								required
							/>
						</div>
						<Button onClick={handleSubmitEdit}>Save</Button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default StaffDirectory;
