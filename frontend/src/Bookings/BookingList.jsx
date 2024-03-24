import React, { useState, useEffect, useContext } from "react";
import { HostContext, UserContext } from "../App.jsx";
import { Loader, isOptionsGroup } from "@mantine/core";
import { httpRequest } from "../utils.js";
import { BookingListComponent } from "./BookingListComponent.jsx";

/**
 * A component that returns the render of a list view.
 * @param {function} onItemClick - Callback for what end_time do when an item is clicked on (i.e. open modal)
 * @param {Array[Object]} displayAssets - An array of javascript objects that represent each item (i.e. Room or equipment)
 * @param {string} assetType - A string of either "equipment" or "room" that specifies the asset requested.
 */
function BookingListView({
	onItemClick,
	assetType,
	filters,
	selectedDates,
	selectedAssets,
	bookingFilter, // all bookings or my bookings
	isUpdated, //Re-render
}) {
	const { host } = useContext(HostContext);
	const { currentUser } = useContext(UserContext); // Current logged-in user
	const [isLoading, setIsLoading] = useState(true);
	const [assets, setAssets] = useState([]);

	useEffect(() => {
		let endpoint = `${host}/bookings/filter?`;
		const queryParams = new URLSearchParams();

		if (bookingFilter === "My Bookings" && currentUser) {
			// Fetch only the current user's bookings
			endpoint = `${host}/bookings/user/${currentUser.id}/`;
		} else {
			// Fetch all bookings, with date and room filters
			if (selectedDates[0]) queryParams.append("start_time", selectedDates[0]);
			if (selectedDates[1]) queryParams.append("end_time", selectedDates[1]);
			selectedAssets.forEach((asset) => queryParams.append("resource", asset));
		}

		console.log(endpoint + queryParams.toString());

		httpRequest({
			endpoint: endpoint + queryParams.toString(),
			onSuccess: (data) => {
				let sterilized = data.map((asset) => convertToISO(asset));
				setAssets(sterilized);
				setIsLoading(false);
			},
		});
	}, [
		host,
		currentUser,
		bookingFilter,
		selectedDates,
		selectedAssets,
		isUpdated,
	]);

	//Filters based on types
	const filteredAssets =
		selectedAssets.length > 0
			? assets.filter(
					(asset) =>
						selectedAssets.includes(asset.resources_name) &&
						asset.resource_type == assetType
			  )
			: assets.filter((asset) => asset.resource_type == assetType);

	const dateHeaders = getUniqueDateHeaders(
		filteredAssets.map((asset) => asset.start_time)
	);

	return isLoading ? (
		<Loader size={50} color="orange" />
	) : (
		<ul className="bounding-box flex flex-col gap-8 px-[10px] my-8 py-8 flex-grow rounded-[12px]">
			{dateHeaders.map((dateHeader) => (
				<li key={dateHeader.toISOString()}>
					<DateHeaderComponent date={dateHeader} />
					<ul className="day-list flex flex-col gap-4">
						{filteredAssets
							.filter(
								(asset) =>
									asset.start_time.toDateString() === dateHeader.toDateString()
							)
							.map((asset) => (
								<BookingListComponent
									key={asset.id}
									asset={asset}
									onItemClick={onItemClick}
								/>
							))}
					</ul>
				</li>
			))}
		</ul>
	);
}

/**
 * A component that returns the renders of a date header
 * @param {Date} - The date to be rendered
 */
function DateHeaderComponent({ date }) {
	return (
		<div className="dateHeader mb-2 flex items-center">
			<div className="date flex gap-4 items-stretch mr-3">
				<h2 className="text-4xl font-bold text-orange-600 uppercase">
					{date.toLocaleString("en-us", { weekday: "long" })}
				</h2>
				<div className="flex flex-col justify-between">
					<h3 className="text-xl font-bold text-neutral-800 uppercase">
						{date.toLocaleString("default", { month: "long" })} {date.getDate()}
					</h3>
					<h3 className="text-xs font-medium text-neutral-400">
						{date.getFullYear()}
					</h3>
				</div>
			</div>
			<span className="flex-grow h-1 bg-gradient-to-r from-neutral-400 from-10% to-transparent to-100%" />
		</div>
	);
}

/**
 * A function that returns all of the date headers to show from the list of display items.
 * Dates without any booked slots will not be displayed.
 * @param {Array[Date]} dates - An array of booking dates, including time
 * @returns {Array[Date]} - An array of unique dates without considering time
 */
const getUniqueDateHeaders = (dates) => {
	const uniqueDates = [];
	const serialized = new Set(); //Used to hold the date string to avoid reference comparison

	dates.forEach((date) => {
		date = new Date(date); //Convert string to ISO date
		const newDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		); //Ignore hours, seconds, minutes, in comparison

		if (!serialized.has(newDate.toString())) {
			serialized.add(newDate.toString());
			uniqueDates.push(newDate); //Date object so that Date-methods can still be used.
		}
	});
	return uniqueDates;
};

/** A function that returns an object, with all datestring fields converted into an ISO date
 *
 * @param {Object} obj
 * @returns {Object} - The object with datestrings converted to Date objects
 */
const convertToISO = (obj) => {
	const newObj = {};
	for (const key in obj) {
		if (key === "start_time" || key === "end_time") {
			const date = new Date(obj[key]);
			if (!isNaN(date.getTime())) {
				newObj[key] = date;
			} else {
				newObj[key] = obj[key]; // If not a valid date, retain the original value
			}
		} else {
			newObj[key] = obj[key]; // If not a string, retain the original value
		}
	}
	return newObj;
};

export default BookingListView;
