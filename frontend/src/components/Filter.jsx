import React, { useState, useEffect } from "react";
import { Tooltip } from "@mantine/core";
import { HostContext } from "../App";
import { useContext } from "react";

function Filter({ onSearch, onFilterChange }) {
	const { host } = useContext(HostContext);
	const [selectedFilters, setSelectedFilters] = useState({});
	const [isFilterExpanded, setIsFilterExpanded] = useState(false); // Default to true for unfolded state

	useEffect(() => {
		// Fetch filters from the endpoint
		// fetch("http://127.0.0.1:8000/users/accessTypes/")
		fetch(`${host}/users/accessTypes/`)
			.then((response) => response.json())
			.then((data) => {
				// Initialize all filters to false
				const initialFilters = {};
				data.forEach((filterObj) => {
					initialFilters[filterObj.name] = false;
				});
				setSelectedFilters(initialFilters);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, []);

	useEffect(() => {
		// Notify parent component whenever selectedFilters change
		onFilterChange(
			Object.entries(selectedFilters)
				.filter(([_, isSelected]) => isSelected)
				.map(([filter, _]) => filter)
		);
	}, [selectedFilters]);

	const toggleFilter = (filter) => {
		setSelectedFilters({
			...selectedFilters,
			[filter]: !selectedFilters[filter],
		});
	};

	const handleInputChange = (event) => {
		onSearch(event.target.value);
	};

	const toggleFilterContainer = () => {
		setIsFilterExpanded(!isFilterExpanded);
	};

	return (
		<div className="filter-wrapper">
			<div className="filter-container">
				<div className="search-bar">
					<div className="filter-bar-text">
						<i
							className="fa-solid fa-magnifying-glass"
							style={{
								paddingRight: "10px",
								color: "#FF7A00",
								paddingBottom: "10px",
								fontSize: "24px",
							}}
						></i>
						<h1>Search</h1>
					</div>
					<input
						type="text"
						placeholder="Search for a User"
						className="search-input"
						onChange={handleInputChange}
					/>
				</div>
				<div className="filter-section">
					<Tooltip label="Click to toggle expanding the filters.">
						<div
							className="filter-bar-text cursor-pointer"
							onClick={toggleFilterContainer}
						>
							<i
								className="fa-solid fa-filter"
								style={{
									paddingRight: "12px",
									color: "#FF7A00",
									paddingBottom: "5px",
									fontSize: "24px",
								}}
							></i>
							<h1>Filter</h1>
							<i className="fa-solid fa-hand-pointer ml-auto text-[14px]"></i>
						</div>
					</Tooltip>
					{isFilterExpanded && (
						<div style={{ margin: "0 0 5px 0px" }}>
							<strong>User Type</strong>
							<div className="filters">
								{Object.entries(selectedFilters).map(
									([filter, isSelected], index) => (
										<React.Fragment key={filter}>
											<div className="filter-item">
												<div
													className={`checkbox ${isSelected ? "selected" : ""}`}
													onClick={() => toggleFilter(filter)}
												></div>
												<span onClick={() => toggleFilter(filter)}>
													{filter}
												</span>
											</div>
											{index === 3 && (
												<strong style={{ margin: "10px 0 5px 0" }}>
													SIC Role
												</strong>
											)}
										</React.Fragment>
									)
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Filter;
