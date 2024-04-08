import React, { useContext, useState } from "react";
import DraggableSlot from "./DraggableSlot";
import { UserContext } from "../App";
import BookingPopover from "./BookingPopover";
import { Tooltip } from "@mantine/core";

// Helper function to parse time range string into Date objects
function parseTimeRange(timeRange) {
	const [startStr, endStr] = timeRange.split(" - ");
	const startTime = parseTime(startStr);
	const endTime = parseTime(endStr);

	return [startTime, endTime];
}

// Helper function to parse time string into Date object
function parseTime(timeStr) {
	const [time, period] = timeStr.split(" ");
	const [hours, minutes] = time.split(":");

	let hours24 = parseInt(hours, 10);
	if (period === "PM" && hours24 !== 12) {
		hours24 += 12;
	} else if (period === "AM" && hours24 === 12) {
		hours24 = 0;
	}

	const result = new Date();
	result.setHours(hours24, parseInt(minutes, 10), 0, 0);
	return result;
}

/**
 * Represents a single column in the on the column view, shows the Resource name and the bookings for the day, allows for editing bookings and dragging to create new bookings.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.column - The column object containing column information.
 * @param {Function} props.onBookingEdit - The function to handle editing a booking.
 * @returns {JSX.Element} The rendered Column component.
 */
const Column = ({ column, onBookingEdit }) => {
	const { currentUser } = useContext(UserContext);

	// ---------------------------------------------------------------------------------------------------------------------
	// Generate all time slots for the day in 15-minute intervals (empty by default)
	const generateTimeSlots = () => {
		const timeSlots = [];

		// Loop through 15-minute intervals from 7am to 8pm
		for (let currentHour = 7; currentHour < 20; currentHour++) {
			for (let currentMinute = 0; currentMinute < 60; currentMinute += 15) {
				const currentTime = new Date();
				currentTime.setHours(currentHour, currentMinute, 0, 0);

				// Generate the time slot in the format "7:00 AM - 7:15 AM"
				const timeSlot = `${currentTime.toLocaleTimeString([], {
					hour: "numeric",
					minute: "numeric",
				})} - ${new Date(currentTime.getTime() + 15 * 60000).toLocaleTimeString(
					[],
					{ hour: "numeric", minute: "numeric" }
				)}`;
				// Calculate the index number for the time slot (0-52), used for positioning the draggable slot for new bookings
				const indexNum = (currentHour - 7) * 4 + currentMinute / 15;
				timeSlots.push({ display_time: timeSlot, index_number: indexNum });
			}
		}
		return timeSlots;
	};

	// ---------------------------------------------------------------------------------------------------------------------
	const BookingList = ({
		bookings,
		generateTimeSlots,
		onSlotClick,
		hasPermission,
	}) => {
		let timeslots = generateTimeSlots();
		let realBookings = [];

		bookings.map((booking) => {
			const unavailable = [];
			const startTime = new Date(booking.start_time);
			const endTime = new Date(booking.end_time);

			// Calculate the start and end times in 15-minute increments
			const startHour = Math.floor(startTime.getMinutes() / 15) * 15;
			const endHour = Math.ceil(endTime.getMinutes() / 15) * 15;

			// Loop through the time slots and add to the unavailable list
			for (
				let currentHour = startTime.getHours();
				currentHour <= endTime.getHours();
				currentHour++
			) {
				for (
					let currentMinute =
						currentHour === startTime.getHours() ? startHour : 0;
					currentMinute < (currentHour === endTime.getHours() ? endHour : 60);
					currentMinute += 15
				) {
					const currentTime = new Date();
					currentTime.setHours(currentHour, currentMinute, 0, 0);
					const timeSlot = `${currentTime.toLocaleTimeString([], {
						hour: "numeric",
						minute: "numeric",
					})} - ${new Date(
						currentTime.getTime() + 15 * 60000
					).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}`;
					unavailable.push({ display_time: timeSlot });
				}
			}

			// Get the full time range for the booking in the format "7:00 AM - 7:45 AM", like the sum of all unavailable time slots for a booking
			const roundedStartTime = new Date(startTime);
			roundedStartTime.setMinutes(startHour);
			const roundedEndTime = new Date(endTime);
			roundedEndTime.setMinutes(endHour);
			const fullTimeRange = `${roundedStartTime.toLocaleTimeString([], {
				hour: "numeric",
				minute: "numeric",
			})} - ${roundedEndTime.toLocaleTimeString([], {
				hour: "numeric",
				minute: "numeric",
			})}`;

			booking.start_time = startTime;
			booking.end_time = endTime;
			realBookings.push({
				overlapping_slots: unavailable,
				display_time: fullTimeRange,
				booking: true,
				...booking,
			}); //booking (backend)
		});

		// Helper function to update the timeslots array by removing the overlapping slots from the timeslots array
		const updateTimeSlots = (timeslots, bookingSlot) => {
			timeslots = timeslots.filter((slot) => {
				return !bookingSlot.overlapping_slots.some(
					// Check if the slot is in the overlapping slots
					(overlappingSlot) =>
						overlappingSlot.display_time === slot.display_time
				);
			});
			return timeslots;
		};

		// Go through the realBookings and insert into the timeslots array at the correct index
		realBookings.forEach((bookingSlot) => {
			const index = timeslots.findIndex(
				(slot) =>
					// The index to insert a booking is when the end time of the slot is the same as the start time of this booking
					slot.display_time.split(" - ")[1] ===
					bookingSlot.display_time.split(" - ")[0]
			);
			if (index !== -1) {
				timeslots = updateTimeSlots(timeslots, bookingSlot);
				timeslots.splice(index + 1, 0, bookingSlot);
			} else if (bookingSlot.display_time.split(" - ")[0] == "7:00 AM") {
				// If the booking starts at 7:00 AM, insert at the beginning of the array
				timeslots = updateTimeSlots(timeslots, bookingSlot);
				timeslots.splice(0, 0, bookingSlot);
			}
		});

		return (
			<div className="shadow-lg rounded-[12px] overflow-hidden">
				{timeslots.map((slot) => {
					// Calculate the height of the slot based on the time range (in 15-minute increments) * 24px per slot
					const slotHeight =
						Math.ceil(
							(parseTime(slot.display_time.split(" - ")[1]) -
								parseTime(slot.display_time.split(" - ")[0])) /
								(15 * 60000)
						) * 24;
					// If the slot is 30 mins or less, make it a short booking card to remove some padding and fit the content
					const isShortBooking = slotHeight / 24 <= 2;
					// If the slot is 15 mins, don't show the time range
					const is15MinBooking = slotHeight / 24 === 1;

					// TODO: Make the bookings that belong to the user have a different color by adding a class to the div

					return (
						<div key={slot.display_time} className="slot-div">
							{slot.booking ? (
								<div
									className={`column-booking-card ${
										isShortBooking
											? "short-booking-card justify-center"
											: "justify-between"
									} cursor-pointer relative z-1 overflow-hidden flex flex-col rounded-[12px] shadow-custom pl-8 pr-10 py-4 bg-white text-sm capitalize`}
									key={slot}
									style={{ height: `${slotHeight}px` }}
									onClick={() => hasPermission && onBookingEdit(slot)}
								>
									<p className="font-bold">{slot.title || "Booking"}</p>
									{!is15MinBooking && (
										<p className="text-[0.75rem]">{slot.display_time}</p>
									)}
								</div>
							) : (
								<div
									className="open-booking-slot flex justify-center items-center cursor-pointer overflow-hidden px-4 py-2 text-sm"
									key={slot}
									style={{ height: `${slotHeight}px` }}
									onClick={() => hasPermission && onSlotClick(slot, timeslots)}
								>
									<p className="slot-time">{slot.display_time}</p>
								</div>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	// ---------------------------------------------------------------------------------------------------------------------

	// Check if the user accessType contains at least 1 of the elements from the column.access_type
	const hasPermission = column.access_type.some((permission) =>
		currentUser.accessType.map((type) => type.name).includes(permission)
	);

	// State to manage the currently selected slot
	const [selectedSlot, setSelectedSlot] = useState(null);

	// Function to handle click on a time slot
	const handleSlotClick = (timeSlot, timeslots) => {
		const startTime = parseTimeRange(timeSlot.display_time)[0];

		// Loop through the timeslots and find the index_number of the selected slot until we hit a booking which will not have this
		const indexOfNextBooking = timeslots.findIndex((slot) => {
			const slotStartTime = parseTimeRange(slot.display_time)[0];
			return (
				slotStartTime > parseTimeRange(timeSlot.display_time)[0] && slot.booking
			);
		});

		// If there is a booking after the selected slot, set the lastAvailableSlot to the index_number of the slot before the booking
		// If there is no booking after the selected slot, set the lastAvailableSlot to 51 (the last slot in the day)
		const lastAvailableSlot =
			indexOfNextBooking !== -1
				? timeslots[indexOfNextBooking - 1].index_number
				: 51;

		setSelectedSlot({
			index: timeSlot.index_number,
			start_time: startTime,
			end_time: new Date(startTime.getTime() + 15 * 60000), // default to 15 minutes length for now
			lastAvailableSlot: lastAvailableSlot,
		});
	};

	const onResize = (event, data) => {
		const { size } = data;
		const heightMultiple = Math.round(size.height / 24) * 24; // Calculate the nearest multiple of 24 for the height
		const newEndTime = new Date(
			selectedSlot.start_time.getTime() + (heightMultiple / 24) * 15 * 60000
		);
		setSelectedSlot({ ...selectedSlot, end_time: newEndTime });
	};

	return (
		<div
			key={column.id}
			className={`booking-column h-full flex flex-col relative ${
				selectedSlot ? "currentlyBooking" : ""
			} ${hasPermission ? "" : "no-permission-column"}`}
		>
			{console.dir(column)}
			<BookingPopover
				assetImage={column.image}
				assetDescription={column.description}
				assetPermissions={column.access_type} //List
				assetCode={column.room_code}
				assetName={column.name}
			>
				<div className="flex justify-center items-center min-h-[80px] h-[80px] mb-[20px] rounded-[12px] shadow-custom w-[100] py-2 px-4 bg-white">
					<div className="flex flex-col justify-center items-center">
						<p className="text-lg font-bold capitalize text-center">
							{column.name}
						</p>
						{column.room_code &&
							<p className="text-sm font-semibold text-blue-950">
								{column.room_code}
								<Tooltip label = "Pin code required to access the asset.">
									<i className = "fa fa-info-circle ml-2"/>
								</Tooltip>
							</p>
						}
					</div>
				</div>
			</BookingPopover>
			<div className="booking-column-width py-0 px-0 rounded-[12px] flex flex-col flex-grow">
				<BookingList
					bookings={column.bookings}
					generateTimeSlots={generateTimeSlots}
					onSlotClick={handleSlotClick}
					hasPermission={hasPermission}
				/>
				{selectedSlot && (
					<DraggableSlot
						selectedSlot={selectedSlot}
						setSelectedSlot={setSelectedSlot}
						onResize={onResize}
						onRelease={onBookingEdit}
						resourceName={column.name}
					/>
				)}
			</div>
		</div>
	);
};

export default Column;
