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
    const timeRange = [7, 20] //Opening times are between 7AM and 8PM

    //TODO: Change this to prop
    let available = ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"]

    const form = useForm({
        initialValues: {
            // start and end times are split from their standard date formatting so that
            // date/time pickers are useable. They will be recombined on (valid) submit.
            name: currentBooking?.name ?? "",
            date: currentBooking?.start_time ? currentBooking.start_time : new Date, //Default to today
            startTime: currentBooking?.start_time ? serializeTime(currentBooking.start_time) : "",
            endTime: currentBooking?.end_time ? serializeTime(currentBooking.end_time) : "",
            description: currentBooking?.description ?? "",
            public: currentBooking?.public ?? true,
            booker: currentBooking?.booker ?? currentUser,
        },
        validate: {
            //TODO: Times between (and including) start and end cannot be booked.
            startTime: (value, values) => (
                !(value)
                ? 'Start time must be selected'
                : timeIsGreaterThan(deserializeTime(value), deserializeTime(values.endTime)) //Checks if start time exceeds end time
                ? 'Start time must come after end time'
                : null
                    
            ),
            endTime: (value) => (
                !(value)
                    ? 'End time must be selected'   //Time booked is a multiple of interval
                    : null
            ),
            name: (value) => {
                !(value)
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
        transformValues: ({date, ...values}) => {
            console.dir({...values})
            const transformedStart = values.startTime ? new Date(date.setHours(...deserializeTime(values.startTime))) : "";
            const transformedEnd = values.endTime ? new Date(date.setHours(...deserializeTime(values.endTime))) : "";
            return {
                ...values,
                startTime: transformedStart,
                endTime: transformedEnd,
            }
        }
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
                <Select
                    label="From"
                    checkIconPosition="right"
                    placeholder="from"
                    data = {getTimePeriods(interval, ...timeRange)}
                    searchable
                    clearable
                    withAsterisk
                    maxDropdownHeight={140}
                    {...form.getInputProps('startTime')}
                />

                <Select
                    label="To"
                    checkIconPosition="right"
                    placeholder="to"
                    data = {getTimePeriods(interval, ...timeRange)}
                    searchable
                    clearable
                    withAsterisk
                    maxDropdownHeight={140}
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

//Gets the time from a Date object such that it can be loaded by the Select
const serializeTime = (date) => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
      
    //Return the formatted time
    return `${hours}:${formattedMinutes} ${ampm}`;
}

//Returns the timestring as a 24hr (hours, minutes) tuple
const deserializeTime = (timestring) => {
    // Split the time string by ':' to separate hours and minutes (12 hour format + [AP]M)
    const [time, ampm] = timestring.split(/(?=[AP]M)/i);
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    
    // Convert hours to 24-hour format if necessary
    let hour24 = hours

    if (ampm == "PM") {
        hour24 += 12
    }

    return [hour24, minutes];
}

//Gets the time periods between a certain time range
const getTimePeriods = (interval, startHour, endHour) => {
    const periods = [];
  
    // Loop through each interval
    for (let i = startHour * 60; i < endHour * 60; i += interval) {
        // Convert current interval to hours and minutes
        let hours = Math.floor(i / 60);
        const minutes = i % 60;
      
        // Determine AM/PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        // Convert to 12-hour format
        hours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');

        // Add formatted time period to periods array
        periods.push(`${hours}:${formattedMinutes} ${ampm}`);
    }
  
    return periods;
}


//Does an int-wise comparison of deserialized time (standard > symbol compares them as strings)
//which causes 1x < y (where y is a single digit (AM)) 
const timeIsGreaterThan = (deserializedTime1, deserializedTime2) => {
    for (let i = 0; i < deserializedTime1.length; i++) {
        // Convert elements to integers before comparison
        const element1 = parseInt(deserializedTime1[i]);
        const element2 = parseInt(deserializedTime2[i]);
        
        console.log(element1)
        console.log(element2)
        if (element1 > element2) {
          return true;
        }
        else if (element1 < element2) {
            return false; //Short circuits on hours; avoid minute-wise comparison
        }
      }
      return true; //Times are equal
    }