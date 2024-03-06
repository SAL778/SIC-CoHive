import React, { useState, useContext } from "react"
import { UserContext } from "../../App.jsx";
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Checkbox } from "@mantine/core";
import { TimeInput, DatePicker } from "@mantine/dates";

import { SearchableDropdown } from "../Inputs/SearchableDropdown.jsx";


export default BookingFormComponent

/**
 * A component function that returns the render of the booking form, and handles values changes.
 * @param {Object} currentBooking - A booking object, if one exists.
 * @param {Available} availableAssets - A list of assets available to be booked
 * @param {string} type - A string that tells what type of assets were provided (i.e room, assets)
 */
function BookingFormComponent({currentBooking = null, availableAssets, type}) {

    const { currentUser } = useContext(UserContext);
    //const [timeErrorMessage, setTimeErrorMessage] = null

    //TODO: Change this to prop
    let available = ["Room A", "Room B", "Room C", "Room D"]

    const form = useForm({
        initialValues: {
            // start and end times are split from their standard date formatting so that date/time pickeres are useable.They will be recombined on submit.
            date: currentBooking?.start_time ? currentBooking.start_time : new Date, //Default to today
            startTime: currentBooking?.start_time ? serializeTime(currentBooking.start_time) : "00:00",
            endTime: currentBooking?.end_time ? serializeTime(currentBooking.end_time) : "23:59",
            description: currentBooking.description ?? "",
            public: currentBooking.public ?? true,
            booker: currentBooking.booker ?? currentUser,
        },
    });

    return (
        <form>

            <DatePicker
                hideOutsideDates
                allowSingleDateInRange
                {...form.getInputProps('date')}
            />

            <div className = "timeSelector flex gap-3">
                <TimeInput
                    label="from"
                    withAsterisk
                    {...form.getInputProps('startTime')}
                />
                <TimeInput
                    label="to"
                    withAsterisk
                    {...form.getInputProps('endTime')}
                />
            </div>

            <Textarea
                label = "Description"
                placeholder = "Add a brief description of this booking"
                rows={3}
                resize = 'none'
                {...form.getInputProps('description')}
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

//Gets the time from a Date object such that it can be used by Mantine's timepicker (i.e HH:mm)
const serializeTime = (date) => {
    let hours = date.getHours()

    if (hours < 10) {
        hours = "0" + hours //Padding to match time picker
    }

    return `${hours}:${date.getMinutes()}`
}

const serializeDate = (date) => {
    //Gets the day/month/year of an date.
    return `${date.getDate()}`
}