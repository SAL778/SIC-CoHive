import React, { useState, useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import "../components/Forms/form.css";

function Filter({ onFilterChange, assetType }) {
	const [selectedFilters, setSelectedFilters] = useState({});
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [selectedAssets, setselectedAssets] = useState([]);
	const [bookingFilter, setBookingFilter] = useState("All Bookings");

	// Fetch all the rooms and initialize the filters from the database
	useEffect(() => {
		fetch(`http://127.0.0.1:8000/bookings/resources/filter?type=${assetType}`)
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
	}, [assetType]);

	// Notify parent that the filters have changed for the sekected dates and rooms
	useEffect(() => {
		onFilterChange({
			selectedFilters: Object.entries(selectedFilters)
				.filter(([_, isSelected]) => isSelected)
				.map(([filter]) => filter),
			fromDate: fromDate
				? new Date(fromDate).toISOString().split("T")[0]
				: null,
			toDate: toDate ? new Date(toDate).toISOString().split("T")[0] : null,
			selectedAssets,
			bookingFilter,
		});
	}, [selectedFilters, fromDate, toDate, selectedAssets, bookingFilter]);

	// New handler for toggling filters
	const toggleFilter = (filter) => {
		setSelectedFilters({
			...selectedFilters,
			[filter]: !selectedFilters[filter],
		});

		if (!selectedFilters[filter]) {
			setselectedAssets([...selectedAssets, filter]);
		} else {
			setselectedAssets(selectedAssets.filter((room) => room !== filter));
		}
	};

	// New handler for booking filters
	const handleBookingFilterChange = (filter) => {
		setBookingFilter(filter);
	};

	return (
		<div className="px-[10px] py-8" style={{ minWidth: "300px" }}>
			<div className="filter-container">
				<div className="filter-section">
					<div className="filter-bar-text">
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
					</div>
					<div className="bookings-filter">
						<strong style={{ marginBottom: "5px" }}>Bookings:</strong>
						<div className="filter-item">
							<div
								className={`radio-button ${
									bookingFilter === "All Bookings" ? "selected" : ""
								}`}
								onClick={() => handleBookingFilterChange("All Bookings")}
							></div>
							<span onClick={() => handleBookingFilterChange("All Bookings")}>
								All Bookings
							</span>
						</div>
						<div className="filter-item">
							<div
								className={`radio-button ${
									bookingFilter === "My Bookings" ? "selected" : ""
								}`}
								onClick={() => handleBookingFilterChange("My Bookings")}
							></div>
							<span onClick={() => handleBookingFilterChange("My Bookings")}>
								My Bookings
							</span>
						</div>
					</div>
					<div style={{ margin: "0 0 5px 0px" }}>
						<strong>From Date:</strong>
					</div>

					<DatePickerInput
						label="Select a from date"
						value={fromDate}
						onChange={(value) => {
							const parsedDate = new Date(value).toISOString().split("T")[0];
							console.log(parsedDate);
							setFromDate(value);
						}}
					/>

					<div style={{ margin: "10px 0 5px 0px" }}>
						<strong>To Date:</strong>
					</div>

					<DatePickerInput
						label="Select a to date"
						value={toDate}
						onChange={(value) => {
							const parsedDate = new Date(value).toISOString().split("T")[0];
							console.log(parsedDate);
							setToDate(value);
						}}
					/>

					<div style={{ margin: "10px 0 5px 0px" }}>
						<strong>Rooms:</strong>
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
