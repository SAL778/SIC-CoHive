import React, { useContext } from "react";
import { UserContext } from "../App.jsx";

/**
 * A component that returns the render of a list item to be displayed.
 * @param {Object} asset - The object representation of an asset (room or equipment)
 */
export function BookingListComponent({ asset, onItemClick }) {
	const { currentUser } = JSON.parse(localStorage.getItem("currentUser"));

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
