import React, { useState, useEffect } from "react";
import CommunityCard from "./components/CommunityCard";
import image from "./assets/community-person.jpg";

function Community() {
	const [users, setUsers] = useState([]);
	const [searchText, setSearchText] = useState("");

	// Set up a timeout to delay the execution of fetchData
	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			fetchData();
		}, 600);

		return () => clearTimeout(delayDebounceFn);
	}, [searchText]);

	const fetchData = () => {
		fetch(`http://127.0.0.1:8000/users/?search=${searchText}`)
			.then((res) => res.json())
			.then((data) => {
				setUsers(data);
				console.log(data);
			});
	};

	const handleInputChange = (event) => {
		const { value } = event.target;
		setSearchText(value);
	};

	return (
		<div className="container mx-auto p-4">
			<div className="mb-8">
				<input
					type="text"
					placeholder="Search users..."
					className="w-full p-2 border border-gray-300 rounded-md"
					onChange={handleInputChange}
				/>
			</div>
			<div className="flex flex-wrap justify-flex-start gap-[32px] py-[30px]">
				{users.map((user, index) => (
					<CommunityCard
						key={index}
						userID={user.id}
						firstName={user.first_name}
						lastName={user.last_name}
						imageUrl={user.profileImage}
					/>
				))}
			</div>
		</div>
	);
}

export default Community;
