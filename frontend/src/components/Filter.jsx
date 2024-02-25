import React, { useState, useEffect } from "react";

//HARD CODED FILTERS for now. Uncomment the GET request using the useEffect hook once the endpoint is available.
function Filter({ onSearch }) {
	const [selectedFilters, setSelectedFilters] = useState({
		"SIC Member": false,
		Organization: false,
		"SIC Administrator": false,
		"Audio Engineer": false,
		"Graphic Designer": false,
		"VFX Artist": false,
		Animator: false,
	});

	// DO NOT REMOVE. UNCOMMENT ONCE THE CORRECT ENDPOINT IS AVAILABLE.

	// function Filter({ onSearch }) {
	// 	const [selectedFilters, setSelectedFilters] = useState({});

	// 	useEffect(() => {
	// 		fetch("http://localhost:8000/filters/") // GET request for the filters, endpoint needed.
	// 			.then((response) => response.json())
	// 			.then((data) => {
	// 				const filters = data; // array of filters from the response
	// 				const initialFilterState = {};
	// 				filters.forEach((filter) => {
	// 					initialFilterState[filter] = false;
	// 				});
	// 				setSelectedFilters(initialFilterState);
	// 			})
	// 			.catch((error) => {
	// 				console.error("There was an error! Error:", error);
	// 			});
	// 	}, []);

	const toggleFilter = (filter) => {
		setSelectedFilters({
			...selectedFilters,
			[filter]: !selectedFilters[filter],
		});
	};

	const handleInputChange = (event) => {
		onSearch(event.target.value);
	};

	return (
		<div className="filter-wrapper">
			<div className="filter-container">
				<div className="search-bar">
					<div className="filter-bar-text">
						<i
							class="fa-solid fa-magnifying-glass"
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
					<div className="filter-bar-text">
						<i
							class="fa-solid fa-filter"
							style={{
								paddingRight: "12px",
								color: "#FF7A00",
								paddingBottom: "5px",
								fontSize: "24px",
							}}
						></i>
						<h1>Filter</h1>
					</div>
					<div style={{ margin: "0 0 5px 0px" }}>
						{/* paddingBottom doesn't work on this strong tag */}
						<strong>User Type</strong>
					</div>
					<div className="filters">
						{Object.entries(selectedFilters).map(
							([filter, isSelected], index) => (
								<React.Fragment key={filter}>
									<div className="filter-item">
										<div
											className={`checkbox ${isSelected ? "selected" : ""}`}
											onClick={() => toggleFilter(filter)}
										></div>
										<span onClick={() => toggleFilter(filter)}>{filter}</span>
									</div>
									{index === 2 && (
										<strong style={{ margin: "10px 0 5px 0" }}>SIC Role</strong>
									)}
								</React.Fragment>
								//react fragment is used to group a list of children without adding extra nodes to the DOM. It will group multiple elements.
								//React Fragments can be replaced with <> and </> tags.
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Filter;
