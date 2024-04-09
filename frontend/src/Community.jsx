import React, { useState, useEffect } from "react";
import CommunityCard from "./components/CommunityCard";
import image from "./assets/community-person.jpg";
import Filter from "./components/Filter";
import Pagination from "./components/CommunityPagination";
import { HostContext } from "./App";
import { useContext } from "react";

function Community() {

	const { host } = useContext(HostContext);

	const [users, setUsers] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [selectedFilters, setSelectedFilters] = useState([]);
	const [selectedPage, setSelectedPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			fetchData();
		}, 300); // Set up a timeout to delay the execution of fetchData. Not too many frequent requests to the server.

		return () => clearTimeout(delayDebounceFn);
	}, [searchText, selectedFilters, selectedPage]);

	const fetchData = () => {
		const filterQuery =
			selectedFilters.length > 0 ? `&filter=${selectedFilters.join(",")}` : "";
		
		fetch(`${host}/users/?search=${searchText}${filterQuery}&page=${selectedPage}`)
			.then((res) => res.json())
			.then((data) => {
				setUsers(data.users);
				setTotalPages(data.total_pages);
			});
	};

	const handleSearch = (searchText) => {
		setSearchText(searchText);
	};

	const handleFilterChange = (filters) => {
		setSelectedFilters(filters);
	};

	const handlePageChange = (page) => {
		setSelectedPage(page);
	};	

	return (
        <div className="parent-container-community content-container flex max-w-[1600px] w-full mx-auto px-[10px] pb-[10px] gap-10 overflow-hidden">
            <Filter onSearch={handleSearch} onFilterChange={handleFilterChange} />
            <div className="flex-grow py-[30px]">
                <div id="pagination" className="flex justify-center items-center gap-4 mb-[60px]">
                    <Pagination
                        totalPages={totalPages}
                        selectedPage={selectedPage}
                        handlePageChange={handlePageChange}
                    />
                </div>
                <div id="community-container">
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
        </div>
    );
}

export default Community;
