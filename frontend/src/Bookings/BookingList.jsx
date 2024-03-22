import React, { useState, useEffect, useContext } from "react";
import { HostContext, UserContext } from "../App.jsx";
import { Loader, isOptionsGroup } from "@mantine/core";
import { httpRequest } from "../utils.js";

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

		console.log(endpoint + queryParams.toString())

		httpRequest({
			endpoint: endpoint + queryParams.toString(),
			onSuccess: (data) => {
				let sterilized = data.map((asset) => convertToISO(asset));
				setAssets(sterilized);
				setIsLoading(false);
			},
		});
	}, [host, currentUser, bookingFilter, selectedDates, selectedAssets]);

	const filteredAssets =
		selectedAssets.length > 0
			? assets.filter((asset) => selectedAssets.includes(asset.resources_name))
			: assets;

	const dateHeaders = getUniqueDateHeaders(
		filteredAssets.map((asset) => asset.start_time)
	);

	return isLoading ? (
		<Loader size={50} color="orange" />
	) : (
		<ul className="flex flex-col gap-8 px-[10px] py-8 flex-grow">
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
								<AssetComponent
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
 * A component that returns the render of a list item to be displayed.
 * @param {Object} asset - The object representation of an asset (room or equipment)
 */
function AssetComponent({ asset, onItemClick }) {
	const { currentUser } = useContext(UserContext);

	const greyOut = !asset.visibility && currentUser?.id != asset?.booker?.id;

	//Convert AM/PM date
	const formatTime = (date) => {
		let hours = date.getHours();
		let minutes = date.getMinutes();

		//Convert to 24 Hour format
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12; //Handle midnight

		//Pad minutes with zeroes if needed
		minutes = minutes >= 10 ? minutes : "0" + minutes;

		//Formatted Time
		return `${hours}:${minutes} ${ampm}`;
	};

	return (
		//TODO: On private, grey everything out
		<div
			className={`flex items-center py-4 px-6 rounded-md cursor-pointer gap-10 ${
				greyOut ? "private-booking" : "shadow-custom"
			}`}
			onClick={() => onItemClick(asset)}
		>
			<div className="colA basis-2 flex-col flex-grow text-neutral-800">
				<h3
					className="text-2xl font-semibold capitalize leading-[1]"
					style={{ color: greyOut ? "#ABABAB" : "inherit" }}
				>
					{asset?.resources_name}
				</h3>
				<p
					className="text-base font-regular"
					style={{ color: greyOut ? "#ABABAB" : "inherit" }}
				>
					{greyOut ? "Booking" : asset?.title}
				</p>
			</div>

			{asset?.type == "room" && (
				<div className="colB basis-1 flex flex-grow text-2xl gap-4">
					<i className="fa fa-location-dot" aria-hidden="true" />
					<p
						className="font-light"
						style={{ color: greyOut ? "#ABABAB" : "inherit" }}
					>
						{asset?.location}
					</p>
				</div>
			)}

			<div className="colC basis-1 flex flex-row flex-grow items-center ">
				<i
					className="fa fa-calendar mr-3 text-2xl text-neutral-800"
					style={{ color: greyOut ? "#ABABAB" : "inherit" }}
				/>
				<div className="timeSlot">
					<p
						className="text-base font-medium text-orange-600"
						style={{ color: greyOut ? "#ABABAB" : "inherit" }}
					>
						{formatTime(asset.start_time)} - {formatTime(asset.end_time)}
					</p>
					<p
						className="text-base font-medium flex gap-1"
						style={{ color: greyOut ? "#ABABAB" : "inherit" }}
					>
						<span>
							{asset.start_time.toLocaleString("en-us", { weekday: "long" })}
						</span>
						<span>
							{asset.start_time.toLocaleString("en-us", { month: "short" })}
						</span>
						<span>{asset.start_time.getDate()}</span>
					</p>
				</div>
			</div>

			<div className="colD basis-1 flex-grow">
				{!greyOut && (
					<>
						{/* Booker not present on private posts */}
						<p className="text-base text-orange-600">
							{asset.user?.first_name}
						</p>
						<p className="text-neutral-800">{asset.user?.email}</p>
					</>
				)}
			</div>
		</div>
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
