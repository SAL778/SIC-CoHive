const Column = ({ column }) => {

    const timeSlot = (
        <div className="rounded-lg overflow-hidden shadow-custom px-4 py-2 mb-2 bg-green-200 text-sm">
            <p className="font-bold">Available</p>
            {/* <p>{currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })} - {new Date(currentTime.getTime() + 15 * 60000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}</p> */}
        </div>
    );

    const generateTimeSlots = () => {
        const timeSlots = [];

        // Loop through 15-minute intervals from 7am to 8pm
        for (let currentHour = 7; currentHour < 20; currentHour++) {
            for (let currentMinute = 0; currentMinute < 60; currentMinute += 15) {
                const currentTime = new Date();
                currentTime.setHours(currentHour, currentMinute, 0, 0);
                const timeSlot = `${currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })} - ${new Date(currentTime.getTime() + 15 * 60000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`;

                timeSlots.push(timeSlot);
            }
        }
        console.log(timeSlots);
        return timeSlots;
    };

    const BookingList = ({ bookings, generateTimeSlots }) => {
        const timeslots = generateTimeSlots(bookings);
        const unavailable = [];

        return (
            <div>
                {bookings.map((booking) => {
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
                            const timeSlot = (
                                <div key={`${currentHour}-${currentMinute}`} className="rounded-lg overflow-hidden shadow-custom px-4 py-2 mb-2 bg-red-200 text-sm">
                                    {/* <p className="font-bold">Unavailable</p> */}
                                    <p>{currentTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })} - {new Date(currentTime.getTime() + 15 * 60000).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}</p>
                                </div>
                            );
                            unavailable.push(timeSlot);
                        }
                    }

                    return (
                        <div key={booking.id} className="border-l-[10px] border-solid border-orange-600 rounded-lg overflow-hidden shadow-custom px-4 py-4 mb-2 bg-white">
                            <p className="font-bold">Title: {booking.id}</p>
                            <p>{new Date(booking.start_time).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })} - {new Date(booking.end_time).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}</p>
                            {/* <p>Booked by ID: {booking.user}</p> */}
                            {/* {unavailable} */}
                        </div>
                    );
                })}
                {unavailable.map(slot => (
                    console.log(slot.props.children)
                ))}
            </div>
        );
    };

    return (
        <div key={column.id} className="h-full flex flex-col">
            <div className="h-[120px] rounded-md shadow-custom w-[100] py-2 px-4 bg-white mb-8">
                <p className="text-lg font-bold uppercase">{column.name}</p>
                <p className="text-lg">{column.room_number}</p>
            </div>
            <div className="py-0 px-0 rounded-md flex flex-col flex-grow w-[260px]" style={{ backgroundColor: column.id % 2 === 0 ? '#F2F4F9' : 'transparent' }}>
                <BookingList bookings={column.bookings} generateTimeSlots={generateTimeSlots} />
            </div>
        </div>
    );
};

export default Column;
