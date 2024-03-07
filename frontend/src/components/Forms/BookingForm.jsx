import React, { useState, useContext } from "react"
import { UserContext } from "../../App.jsx";
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Checkbox, Select } from "@mantine/core";
import { TimeInput, DatePickerInput } from "@mantine/dates";

export default BookingFormComponent

/**
 * A component function that returns the render of the booking form, and handles values changes.
 * @param {Object} currentBooking - A booking object, if one exists.
 * @param {Array[Object]} availableAssets - A list of assets available to be booked
 * @param {string} type - A string that tells what type of assets were provided (i.e room, assets)
 * @param {function} onClose - A callable that triggeres upon form cancellation
 * @param {onSubmit} onSubmit - A callable that triggers upon form submission
 */
function BookingFormComponent({currentBooking = null, availableAssets, onClose, onSubmit}) {

    const { currentUser } = useContext(UserContext);
    const interval = 30;
    //const [timeErrorMessage, setTimeErrorMessage] = null

    //TODO: Change this to prop
    let available = ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"]

    const form = useForm({
        initialValues: {
            // start and end times are split from their standard date formatting so that
            // date/time pickers are useable. They will be recombined on (valid) submit.
            name: currentBooking?.name ?? "",
            date: currentBooking?.start_time ? currentBooking.start_time : new Date, //Default to today
            startTime: currentBooking?.start_time ? serializeTime(currentBooking.start_time) : "00:00",
            endTime: currentBooking?.end_time ? serializeTime(currentBooking.end_time) : "23:59",
            description: currentBooking?.description ?? "",
            public: currentBooking?.public ?? true,
            booker: currentBooking?.booker ?? currentUser,
        },
        validate: {
            //TODO: Times between (and including) start and end cannot be booked.
            startTime: (value, values) => (
                value >= values.endTime 
                    ? 'Start time must come after end time'
                    : parseInt(value.split(":")[1]) % interval != 0
                    ? `End time must be a ${interval}-minute slot`
                    : null
            ),
            endTime: (value) => (
                parseInt(value.split(":")[1]) % interval != 0  
                    ? `End time must be a ${interval}-minute slot`   //Time booked is a multiple of interval
                    : null
            ),
            name: (value) => {
                value == ""
                    ? 'Asset must be selected'
                    : null
            },
            description: (value) => (
                value.length > 50
                    ? 'Description must be less than 50 characters'
                    : null
            ),
            date: (value) => {
                const today = new Date();
                today.setHours(0, 0, 0 ,0) //Rewind to very beginning of the day

                value <= today     //Booking cannot be from yesterday backwards
                    ? 'Chosen date has already passed'
                    : null
            }
        },

        //Convert the to/from dates back into ISO format
        //Exclude the intermediary value "date" from the final booking object
        transformValues: ({date, ...values}) => ({
            ...values,
            startTime: new Date(date.setHours(...values.startTime.split(":"))),  //Adjust the time
            endTime: new Date(date.setHours(...values.endTime.split(":"))),
        })
    });

    return (
        // values represents the booking object
        <form onSubmit = {form.onSubmit(values => {onSubmit(values)})}> 
            {/* This is static until submitted */}
            <h1>{currentBooking?.name || "Book an Asset"}</h1>

            {/* TODO: The name of the room must be in available assets to appear.*/}
            <Select
                label="Select an Asset"
                placeholder="Pick an asset"
                data = {available}
                searchable
                withScrollArea={false}
                styles={{ dropdown: { maxHeight: 140, overflowY: 'auto' } }}
                {...form.getInputProps('name')}
            />

            <DatePickerInput
                label={isToday(form.values.date) ? "Today" : null}
                hideOutsideDates
                allowSingleDateInRange
                allowDeselect= {false}
                firstDayOfWeek={0}
                defaultDate={form.values.date} //Automatically go to the month of current booking
                {...form.getInputProps('date')}
            />

            <div className = "timeSelector flex gap-3">
                <TimeInput
                    maxTime="20:00"
                    minTime="07:00"
                    label="from"
                    withAsterisk
                    {...form.getInputProps('startTime')}
                />
                {/* TODO: min/max times need to be added, but this breaks the validate logic?? */}
                <TimeInput
                    maxTime="20:00"
                    minTime="07:00"
                    label="to"
                    withAsterisk
                    {...form.getInputProps('endTime')}
                />
            </div>

            {/* If currentBooking is private, description will not be present. */}
            { currentBooking?.description &&
             <Textarea
                 label = "Description"
                 placeholder = "Add a brief description of this booking"
                 rows={3}
                 {...form.getInputProps('description')}
             />
            }

            {/* If currentBooking is private, booker information will not be present */}

            { currentBooking?.booker &&
                //TODO: load user info here
                <>
                    <p>Booking as</p>
                    <p>{currentBooking.booker.name}</p>
                </>
            }
            <div className ="flex justify-end gap-3 p-4">
                <button className = "p-3 text-neutral-400 rounded-md" onClick = {onClose}>Close</button>
                <button type = "submit" className ="p-3 text-white bg-orange-600 rounded-md">Submit</button>
            </div>
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

//Gets the time from a Date object such that it can be used by Mantine's timepicker (i.e HH:mm)
const serializeTime = (date) => {
    let hours = date.getHours()

    if (hours < 10) {
        hours = "0" + hours //Padding to match time picker
    }

    return `${hours}:${date.getMinutes()}`
}