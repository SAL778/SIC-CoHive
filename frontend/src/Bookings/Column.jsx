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
    const [startStr, endStr] = timeRange.split(' - ');
    const startTime = parseTime(startStr);
    const endTime = parseTime(endStr);

    return [startTime, endTime];
}

// Helper function to parse time string into Date object
function parseTime(timeStr) {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');

    let hours24 = parseInt(hours, 10);
    if (period === 'PM' && hours24 !== 12) {
        hours24 += 12;
    } else if (period === 'AM' && hours24 === 12) {
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
                const timeSlot = `${currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })} - ${new Date(currentTime.getTime() + 15 * 60000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;
                // Add the time slot to the list, sample format: "7:00 AM - 7:15 AM"
                timeSlots.push(timeSlot);
            }
        }
        return timeSlots;
    };

    // ---------------------------------------------------------------------------------------------------------------------
    const BookingList = ({ bookings, generateTimeSlots }) => {
        let timeslots = generateTimeSlots(bookings);
        let unavailable = [];
        let bookingElements = []

        bookings.map((booking) => {
            const startTime = new Date(booking.start_time);
            const endTime = new Date(booking.end_time);

            // Calculate the start and end times in 15-minute increments
            const startHour = Math.floor(startTime.getMinutes() / 15) * 15;
            const endHour = Math.ceil(endTime.getMinutes() / 15) * 15;

            // Loop through the time slots and add to the unavailable list
            for (let currentHour = startTime.getHours(); currentHour <= endTime.getHours(); currentHour++) {
                for (let currentMinute = (currentHour === startTime.getHours() ? startHour : 0); currentMinute < (currentHour === endTime.getHours() ? endHour : 60); currentMinute += 15) {
                    const currentTime = new Date();
                    currentTime.setHours(currentHour, currentMinute, 0, 0);
                    const timeSlot = `${currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })} - ${new Date(currentTime.getTime() + 15 * 60000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;
                    unavailable.push(timeSlot);
                }
            }

            // Get the full time range for the booking in the format "7:00 AM - 7:45 AM", like the sum of all unavailable time slots for a booking
            const roundedStartTime = new Date(startTime);
            roundedStartTime.setMinutes(startHour);
            const roundedEndTime = new Date(endTime);
            roundedEndTime.setMinutes(endHour);
            const fullTimeRange = `${roundedStartTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })} - ${roundedEndTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;
            bookingElements.push(fullTimeRange);
        });

        // Set the bookingElements to the sorted array
        bookingElements = sortTimeRanges(bookingElements);

        // Go through the timeslots and remove any that are in the unavailable list
        timeslots = timeslots.filter((slot) => !unavailable.includes(slot));

        // Go through the bookingElements and insert into the timeslots array at the correct index
        bookingElements.forEach((bookingElement) => {
            const index = timeslots.findIndex(slot => slot.endsWith(bookingElement.split(' - ')[0]));
            if (index !== -1) {
                const formattedBookingElement = `${bookingElement} (Booking)`;
                timeslots.splice(index, 0, formattedBookingElement);
            }
        });

        return (
            <div>
                {timeslots.map(slot => {
                    return (
                        <div key={slot}>
                            {slot.includes('(Booking)') ? (
                                <div className="rounded-lg overflow-hidden shadow-custom px-4 py-2 bg-blue-200 text-sm" key={slot} style={{ minHeight: `${Math.ceil((parseTime(slot.split(' - ')[1]) - parseTime(slot.split(' - ')[0])) / (15 * 60000)) * 56}px` }}>
                                    <p className="font-bold">Booking</p>
                                    <p>{slot.replace(' (Booking)', '')}</p>
                                </div>
                            ) : (
                                <div className="rounded-lg overflow-hidden shadow-sm px-4 py-2 text-sm" key={slot} style={{ minHeight: '56px' }}>
                                    {/* <p className="font-bold">Available</p>
                                    <p>{slot}</p> */}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
    )};
    // ---------------------------------------------------------------------------------------------------------------------

    return (
        <div key={column.id} className="h-full flex flex-col">
            <div className="min-h-[80px] h-[80px] mb-[20px] rounded-md shadow-custom w-[100] py-2 px-4 bg-white">
                <p className="text-lg font-bold uppercase">{column.name}</p>
                <p className="text-lg">{column.room_number}</p>
            </div>
            <div className="py-0 px-0 rounded-md flex flex-col flex-grow w-[260px]" style={{ backgroundColor: column.id % 2 === 0 ? '#F2F4F9' : '#FFF' }}>
                <BookingList bookings={column.bookings} generateTimeSlots={generateTimeSlots} />
            </div>
        </div>
    );
};

export default Column;
