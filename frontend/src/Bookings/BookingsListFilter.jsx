import React, { useState, useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import "../components/Forms/form.css";

function Filter({ onFilterChange, assetType }) {
	const [selectedFilters, setSelectedFilters] = useState({});

	const [selectedDates, setSelectedDates] = useState([null, null]);
	const [parsedDates, setParsedDates] = useState([null, null]);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [selectedRooms, setSelectedRooms] = useState([]);

	const [bookingFilter, setBookingFilter] = useState("All Bookings");

	// Fetch all the rooms and initialize the filters from the database
	useEffect(() => {
		fetch("http://127.0.0.1:8000/bookings/resources/filter?type=room")
			.then((response) => response.json())
			.then((data) => {
				// Initialize all filters to false
				const initialFilters = {};
				data.forEach((filterObj) => {
					initialFilters[filterObj] = false;
				});
				setSelectedFilters(initialFilters);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, []);

	// Notify parent that the filters have changed for the sekected dates and rooms
	useEffect(() => {
		const formattedFromDate = fromDate
			? new Date(fromDate).toISOString().split("T")[0]
			: null;
		const formattedToDate = toDate
			? new Date(toDate).toISOString().split("T")[0]
			: null;

		onFilterChange({
			selectedFilters: Object.entries(selectedFilters)
				.filter(([_, isSelected]) => isSelected)
				.map(([filter, _]) => filter),
			fromDate: formattedFromDate,
			toDate: formattedToDate,
			selectedRooms,
		});
	}, [selectedFilters, fromDate, toDate, selectedRooms]);

	// New handler for toggling filters
	const toggleFilter = (filter) => {
		setSelectedFilters({
			...selectedFilters,
			[filter]: !selectedFilters[filter],
		});

		if (!selectedFilters[filter]) {
			setSelectedRooms([...selectedRooms, filter]);
		} else {
			setSelectedRooms(selectedRooms.filter((room) => room !== filter));
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
									{/* {index === 3 && (
										<strong style={{ margin: "10px 0 5px 0" }}>SIC Role</strong>
									)} */}
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
