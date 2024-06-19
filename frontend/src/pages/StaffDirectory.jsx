import React, { useState } from "react";
import {
	Table,
	Pagination,
	Button,
	Modal,
	Label,
	TextInput,
	FileInput,
} from "flowbite-react";
import searchIcon from "../assets/search-icon.png";

const StaffDirectory = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [staff, setStaff] = useState([
		{
			id: 1,
			name: "John Doe",
			position: "Manager",
			email: "john.doe@example.com",
			phone: "0711111111",
			image: "",
		},
		{
			id: 2,
			name: "Jane Smith",
			position: "Assistant",
			email: "jane.smith@example.com",
			phone: "0711222222",
			image: "",
		},
		{
			id: 3,
			name: "Alice Johnson",
			position: "Clerk",
			email: "alice.johnson@example.com",
			phone: "0711333333",
			image: "",
		},
	]);

	const [currentPage, setCurrentPage] = useState(1);
	const [staffPerPage] = useState(10);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [newStaff, setNewStaff] = useState({
		name: "",
		position: "",
		email: "",
		phone: "",
		image: "",
	});
	const [currentStaff, setCurrentStaff] = useState({});

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleAddStaff = () => {
		setShowAddModal(true);
	};

	const handleEditStaff = (staff) => {
		setCurrentStaff(staff);
		setNewStaff({ ...staff, image: staff.image });
		setShowEditModal(true);
	};

	const handleSubmitNew = () => {
		const newId = staff.length ? staff[staff.length - 1].id + 1 : 1;
		setStaff([...staff, { ...newStaff, id: newId, image: newStaff.image }]);
		setShowAddModal(false);
		setNewStaff({ name: "", position: "", email: "", phone: "", image: "" });
	};

	const handleSubmitEdit = () => {
		const updatedStaff = staff.map((member) =>
			member.id === currentStaff.id ? currentStaff : member
		);
		setStaff(updatedStaff);
		setShowEditModal(false);
	};

	const filteredStaff = staff.filter(
		(member) =>
			member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.phone.includes(searchTerm)
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
							<Table.HeadCell>Name</Table.HeadCell>
							<Table.HeadCell>Position</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Phone</Table.HeadCell>
							<Table.HeadCell>Action</Table.HeadCell>
						</Table.Head>
						<Table.Body className="pt-3 pb-3 bg-white text-black">
							{currentStaffPage.map((member) => (
								<Table.Row key={member.id}>
									<Table.Cell>{member.name}</Table.Cell>
									<Table.Cell>{member.position}</Table.Cell>
									<Table.Cell>{member.email}</Table.Cell>
									<Table.Cell>{member.phone}</Table.Cell>
									<Table.Cell>
										<button
											onClick={() => handleEditStaff(member)}
											className="flex items-center bg-yellow-500 text-white p-2 rounded-lg"
										>
											Edit
										</button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</div>
				<div className="flex overflow-x-auto sm:justify-center mx-auto mt-4">
					<Pagination
						currentPage={currentPage}
						totalPages={Math.ceil(filteredStaff.length / staffPerPage)}
						onPageChange={onPageChange}
						showIcons
					/>
				</div>
			</div>

			{/* Modal for adding new staff */}
			<Modal
				show={showAddModal}
				size="md"
				popup
				onClose={() => setShowAddModal(false)}
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6">
						<h3 className="text-xl font-medium text-gray-900">
							Add New Staff Member
						</h3>
						<div>
							<Label htmlFor="name" value="Name" />
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
							<Label htmlFor="position" value="Position" />
							<TextInput
								id="position"
								type="text"
								value={newStaff.position}
								onChange={(e) =>
									setNewStaff({ ...newStaff, position: e.target.value })
								}
								required
							/>
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
								required
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
							<Label htmlFor="image" value="Image" />
							<FileInput
								id="image-input"
								name="image"
								value={newStaff.image}
								onChange={(e) =>
									setNewStaff({ ...newStaff, image: e.target.value })
								}
								required
							/>
						</div>
						<div className="flex justify-end">
							<Button onClick={handleSubmitNew}>Add Staff Member</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>

			{/* Modal for editing existing staff */}
			<Modal
				show={showEditModal}
				size="md"
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
							<Label htmlFor="edit-name" value="Name" />
							<TextInput
								id="edit-name"
								type="text"
								value={currentStaff.name}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, name: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="edit-position" value="Position" />
							<TextInput
								id="edit-position"
								type="text"
								value={currentStaff.position}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, position: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="edit-email" value="Email" />
							<TextInput
								id="edit-email"
								type="email"
								value={currentStaff.email}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, email: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="edit-phone" value="Phone" />
							<TextInput
								id="edit-phone"
								type="tel"
								value={currentStaff.phone}
								onChange={(e) =>
									setCurrentStaff({ ...currentStaff, phone: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="edit-image" value="Image" />
							<FileInput
								id="image-input"
								name="image"
								value={newStaff.image}
								onChange={(e) =>
									setNewStaff({ ...newStaff, image: e.target.value })
								}
							/>
						</div>
						<div className="flex justify-end">
							<Button onClick={handleSubmitEdit}>Save Changes</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default StaffDirectory;
