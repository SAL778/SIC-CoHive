import React, { useState, useContext } from "react"
import { UserContext } from "./App.jsx";

export default BookingFormComponent


/**
 * A component function that returns the render of the booking form, and handles values changes.
 * @param {Object} currentBooking - A booking object, if one exists.
 * @returns {Array[Date]} - An array of unique dates without considering time
 */
function BookingFormComponent({currentBooking = null, availableRooms}) {

    const [booking, setBooking] = useState(currentBooking)
    const { currentUser } = useContext(UserContext);

    return (
        <form>
            {/* Select/Display chosen room */}
            <select id="rooms">
                {availableRooms.map((room) => <option>{room.name}</option>)}
            </select>

            {/* Select chosen date */}
            <label for="date">{isToday(booking.date) ? "Today" : null}</label>
            <input type="date" value={booking.date}/>
        
            {/* Select time */}
            <div>
                <label for="start-time">From</label>
                <input type="time" className=""/>
                <label for="end-time">To</label>
                <input type="time" className="text-neutral-400"/>
            </div>

            {/* Description here */}
            <textarea
                name= "booking-description"
                placeholder= "Enter a brief description"
                value = {booking.description}
                readOnly = {currentUser.id == booking.booker.id ? true : null}
            />
        </form>
    )
}

/**
 * A function to check whether a supplied date matches today.
 * @param {Date} date - The date is to be compared to today
 * @returns {Boolean} - Whether or not the supplied date is today
 */
const isToday = (date) => {
    const today = new Date()
    return (
        (date.getDay() == today.getDay()) &&
        (date.getMonth() == today.getMonth()) &&
        (date.getYear() == today.getYear())
    )
}