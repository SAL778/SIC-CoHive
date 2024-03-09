import React, { useState } from "react";
import DraggableSlot from "./DraggableSlot";

// function sortTimeRanges(timeRanges) {
// 	// Convert time ranges to Date objects for comparison
// 	const sortedTimeRanges = timeRanges.sort((a, b) => {
// 		const [startA, endA] = parseTimeRange(a);
// 		const [startB, endB] = parseTimeRange(b);

// 		return startA - startB || endA - endB;
// 	});

// 	return sortedTimeRanges;
// }

// Helper function to parse time range string into Date objects
function parseTimeRange(timeRange) {
	const [startStr, endStr] = timeRange.split(" - ");
	const startTime = parseTime(startStr);
	const endTime = parseTime(endStr);
	console.log(startTime, endTime);

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

const Column = ({ column, onBookingEdit }) => {
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
				timeSlots.push({display_time: timeSlot, booking : false});
			}
		}
		return timeSlots;
	};

	// ---------------------------------------------------------------------------------------------------------------------
	const BookingList = ({ bookings, generateTimeSlots, onSlotClick }) => {
		let timeslots = generateTimeSlots();
		let unavailable = [];
		let realBookings = [];

		bookings.map((booking) => {
			// console.log(booking);
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
					unavailable.push({display_time: timeSlot, booking : false});
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
			realBookings.push({display_time: fullTimeRange, booking: true, ...booking}); //booking (backend)
		});

    // Go through the realBookings and insert into the timeslots array at the correct index
    realBookings.forEach((bookingSlot) => {
        const index = timeslots.findIndex((slot) =>
            slot.display_time.endsWith(bookingSlot.display_time.split(" - ")[0])
        );
		if (index !== -1) {
			timeslots.splice(index + 1, 0, bookingSlot);
		}
		else if (bookingSlot.display_time.split(" - ")[0] == "7:00 AM") {
			timeslots.splice(0, 0, bookingSlot);
		}
    });

	const filteredTimeslots = timeslots.filter((timeslot, index) => {
		return !unavailable.some((unavailableSlot) => unavailableSlot.display_time === timeslot.display_time && !timeslot.booking && index !== 0);
	});

	timeslots = filteredTimeslots;

    return (
        <div>
            {timeslots.map((slot, index) => {
                return (
                    <div key={slot.display_time}>
                        { slot.booking ? (
                            <div className="column-booking-card relative z-1 overflow-hidden flex flex-col justify-between rounded-[12px] shadow-custom pl-8 pr-10 py-4 bg-white text-sm"
								key={slot} 
								style={{ height: `${Math.ceil((parseTime(slot.display_time.split(' - ')[1]) - parseTime(slot.display_time.split(' - ')[0])) / (15 * 60000)) * 24}px` }}
								onClick={() => onBookingEdit(slot)}
							>
								<p className="font-bold">{slot.title || "Booking"}</p>
                                <p className="text-[0.75rem]">{slot.display_time}</p>
                            </div>
                        ) : (
                            <div className="open-booking-slot rounded-[12px] overflow-hidden px-4 py-2 text-sm" key={slot} style={{ height: '24px' }} onClick={() => onSlotClick(index, slot)}>
                                {/* <p>{slot}</p> */}
                            </div>
                        )}
                    </div>
                );
            })}
            </div>
        );
    }
    
    // ---------------------------------------------------------------------------------------------------------------------
    
    // State to manage the currently selected slot
	const [selectedSlot, setSelectedSlot] = useState(null);

	// Function to handle click on a time slot
	const handleSlotClick = (slotIndex, slotTime) => {
		const startTime = parseTimeRange(slotTime.display_time)[0];
		setSelectedSlot({
			index: slotIndex,
			start_time: startTime,
			end_time: new Date(startTime.getTime() + 15 * 60000), // default to 15 minutes length for now
		});
	};

	const onResize = (event, data) => {
		const { size } = data;
		const heightMultiple = Math.round(size.height / 24) * 24; // Calculate the nearest multiple of 24 for the height
		const newEndTime = new Date(
			selectedSlot.start_time.getTime() + (heightMultiple / 24) * 15 * 60000
		);
		setSelectedSlot({ ...selectedSlot, end_time: newEndTime});
	};

    return (
        <div key={column.id} className="booking-column h-full flex flex-col relative">
            <div className="flex justify-center items-center min-h-[80px] h-[80px] mb-[20px] rounded-[12px] shadow-custom w-[100] py-2 px-4 bg-white">
                <p className="text-lg font-bold capitalize">{column.name}</p>
                {/* <p className="text-lg">{column.room_number}</p> */}
            </div>
            <div className="py-0 px-0 rounded-[12px] flex flex-col flex-grow min-w-[260px]">
                <BookingList
					bookings={column.bookings}
					generateTimeSlots={generateTimeSlots}
					onSlotClick={handleSlotClick}
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
