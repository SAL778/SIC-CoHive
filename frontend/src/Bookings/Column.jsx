import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

function sortTimeRanges(timeRanges) {
	// Convert time ranges to Date objects for comparison
	const sortedTimeRanges = timeRanges.sort((a, b) => {
		const [startA, endA] = parseTimeRange(a);
		const [startB, endB] = parseTimeRange(b);

		return startA - startB || endA - endB;
	});

	return sortedTimeRanges;
}

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

const Column = ({ column }) => {
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
				// Add the time slot to the list, sample format: "7:00 AM - 7:15 AM"
				timeSlots.push(timeSlot);
			}
		}
		return timeSlots;
	};

	// ---------------------------------------------------------------------------------------------------------------------
	const BookingList = ({ bookings, generateTimeSlots, onSlotClick }) => {
		let timeslots = generateTimeSlots(bookings);
		let unavailable = [];
		let bookingElements = [];

		bookings.map((booking) => {
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
					unavailable.push(timeSlot);
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
			bookingElements.push(fullTimeRange);
		});

		// Set the bookingElements to the sorted array
		bookingElements = sortTimeRanges(bookingElements);

		// Go through the bookingElements and insert into the timeslots array at the correct index
		bookingElements.forEach((bookingElement) => {
			const index = timeslots.findIndex((slot) =>
				slot.endsWith(bookingElement.split(" - ")[0])
			);
			if (index !== -1) {
				const formattedBookingElement = `${bookingElement} (Booking)`;
				timeslots.splice(index + 1, 0, formattedBookingElement);
			}
		});

		// Remove the unavailable time slots from the timeslots array
		timeslots = timeslots.filter((slot) => !unavailable.includes(slot));

		return (
			<div>
				{timeslots.map((slot, index) => {
					return (
						<div key={slot}>
							{slot.includes("(Booking)") ? (
								<div
									className="rounded-lg overflow-hidden shadow-custom px-4 py-2 bg-blue-200 text-sm"
									key={slot}
									style={{
										minHeight: `${
											Math.ceil(
												(parseTime(slot.split(" - ")[1]) -
													parseTime(slot.split(" - ")[0])) /
													(15 * 60000)
											) * 36
										}px`,
									}}
								>
									<p className="font-bold">Booking</p>
									<p>{slot.replace(" (Booking)", "")}</p>
								</div>
							) : (
								<div
									className="open-booking-slot rounded-lg overflow-hidden px-4 py-2 text-sm"
									key={slot}
									style={{ minHeight: "36px" }}
									onClick={() => onSlotClick(index, slot)}
								>
									{/* <p>{slot}</p> */}
								</div>
							)}
						</div>
					);
				})}
			</div>
		);
	};
	// ---------------------------------------------------------------------------------------------------------------------

	// State to manage the currently selected slot
	const [selectedSlot, setSelectedSlot] = useState(null);

	// Function to handle click on a time slot
	const handleSlotClick = (slotIndex, slotTime) => {
		const startTime = parseTimeRange(slotTime)[0];
		setSelectedSlot({
			index: slotIndex,
			start_time: startTime,
			end_time: new Date(startTime.getTime() + 15 * 60000), // default to 15 minutes length for now
		});
	};

	const onResize = (event, data) => {
		const { size } = data;
		const heightMultiple = Math.round(size.height / 36) * 36; // Calculate the nearest multiple of 36 for the height
		const newEndTime = new Date(
			selectedSlot.start_time.getTime() + (heightMultiple / 36) * 15 * 60000
		);
		setSelectedSlot({ ...selectedSlot, end_time: newEndTime });
	};

	return (
		<div key={column.id} className="h-full flex flex-col relative">
			<div className="min-h-[80px] h-[80px] mb-[20px] rounded-md shadow-custom w-[100] py-2 px-4 bg-white">
				<p className="text-lg font-bold uppercase">{column.name}</p>
				<p className="text-lg">{column.room_number}</p>
			</div>
			<div className="py-0 px-0 rounded-md flex flex-col flex-grow w-[260px]">
				<BookingList
					bookings={column.bookings}
					generateTimeSlots={generateTimeSlots}
					onSlotClick={handleSlotClick}
				/>
				{selectedSlot && (
					<ResizableBox
						width={Infinity} // Full width
						height={Math.max(
							36,
							((selectedSlot.end_time - selectedSlot.start_time) / 60000 / 15) *
								36
						)} // Initial height based on the slot duration
						axis="y"
						minConstraints={[Infinity, 36]} // Minimum size of 15 minutes
						maxConstraints={[Infinity, 36 * 4 * 13]} // Maximum size of 13 hours
						resizeHandles={["s"]}
						onResize={onResize}
						draggableOpts={{ grid: [36, 36] }} // Snap to 36px grid
						style={{
							position: "absolute",
							top: `${selectedSlot.index * 36 + 100}px`, // Calculate the top position based on the slot index
							left: 0,
							zIndex: 2, // Ensure it's above other elements
							backgroundColor: "#F7AB66", // Set the background color to red
							borderRadius: "10px", // Add rounded corners
						}}
					>
						{/* Content for the booking slot, e.g., time range */}
						<div className="text-center">
							Booking from&nbsp;
							{selectedSlot.start_time.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
							&nbsp;-&nbsp;
							{selectedSlot.end_time.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
					</ResizableBox>
				)}
			</div>
		</div>
	);
};

export default Column;
