import React, { useState, useEffect } from "react";
import CommunityCard from "./components/CommunityCard";
import image from "./assets/community-person.jpg";
import Filter from "./components/Filter";

function Community() {
	const [users, setUsers] = useState([]);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			fetchData();
		}, 600); // Set up a timeout to delay the execution of fetchData. Not too many frequent requests to the server.

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

	const handleSearch = (searchText) => {
		setSearchText(searchText);
	};

	return (
		<div className="container mx-auto p-4">
			<Filter onSearch={handleSearch} />
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
