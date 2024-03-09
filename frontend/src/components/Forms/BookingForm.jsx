import React, { useState, useContext } from "react"
import { UserContext } from "../../App.jsx";
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Checkbox, Select } from "@mantine/core";
import { TimeInput, DatePickerInput } from "@mantine/dates";
import './form.css';

export default BookingFormComponent

/**
 * A component function that returns the render of the booking form, and handles values changes.
 * @param {Object} currentBooking - A booking object, if one exists.
 * @param {Array[Object]} availableAssets - A list of assets available to be booked
 * @param {string} type - A string that tells what type of assets were provided (i.e room, assets)
 * @param {function} onClose - A callable that triggeres upon form cancellation
 * @param {function} onSubmit - A callable that triggers upon form submission
 * @param {function} onDelete - A callable that triggers upon form deletion
 */
function BookingFormComponent({currentBooking = null, availableAssets, onClose, onSubmit, onDelete}) {

    const fallbackProfileImage = "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    const fallbackAssetImage = "https://images.unsplash.com/photo-1633633292416-1bb8e7b2832b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    const { currentUser } = useContext(UserContext);

    console.log(currentUser)
    const interval = 15;
    const timeRange = [7, 20] //Opening times are between 7AM and 8PM

    //TODO: Change the resources ID from 1 to something else later.
    const form = useForm({
        initialValues: {
            // start and end times are split from their standard date formatting so that
            // date/time pickers are useable. They will be recombined on (valid) submit.
            id: currentBooking?.id,
            resources: currentBooking?.resources ?? 1, //The ID of the resource asset for backend
            resources_name: currentBooking?.resources_name ?? "",
            date: currentBooking?.start_time ? currentBooking.start_time : new Date, //Default to today
            start_time: currentBooking?.start_time ? serializeTime(currentBooking.start_time) : "",
            end_time: currentBooking?.end_time ? serializeTime(currentBooking.end_time) : "",
            title: currentBooking?.title ?? "",
            visibility: currentBooking?.visibility ?? true,
            user: currentBooking?.user ?? currentUser,
        },
        validate: {
            //TODO: Times between (and including) start and end cannot be booked.
            start_time: (value, values) => (
                !(value)
                ? 'Start time must be selected'
                : timeIsGreaterThan(deserializeTime(value), deserializeTime(values.end_time)) //Checks if start time exceeds end time
                ? 'Start time must come after end time'
                : null
                    
            ),
            end_time: (value) => (
                !(value)
                    ? 'End time must be selected'   //Time booked is a multiple of interval
                    : null
            ),
            name: (value) => {
                !(value)
                    ? 'Asset must be selected'
                    : null
            },
            title: (value) => (
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
            const transformedStart = values.start_time ? new Date(date.setHours(...deserializeTime(values.start_time))).toISOString() : "";
            const transformedEnd = values.end_time ? new Date(date.setHours(...deserializeTime(values.end_time))).toISOString() : "";
            return {
                ...values,
                start_time: transformedStart,
                end_time: transformedEnd
            }
        }
    });

    return (
        // values represents the booking object
        <form onSubmit = {form.onSubmit((values) => {onSubmit(values)})}> 
            <div className = "upperSection flex">
                <img 
                src = {currentBooking?.image ?? fallbackAssetImage}
                className = "rounded-md h-64 w-64 object-cover mr-4"
                />
                <div className = " flex flex-col space-between w-72 h-64 justify-between">
                    <h1 className="capitalize text-2xl font-bold">{currentBooking?.resources_name || "Book an Asset"}</h1>
                    {/* TODO: The name of the room must be in available assets to appear.*/}
                    <Select
                        label="Select an Asset"
                        placeholder="Pick an asset"
                        data = {availableAssets}
                        searchable
                        withScrollArea={false}
                        styles={{ dropdown: { maxHeight: 140, overflowY: 'auto' } }}
                        {...form.getInputProps('resources_name')}
                    />

                    <DatePickerInput
                        label={isToday(form.values.date) ? "Today" : null}
                        hideOutsideDates
                        allowSingleDateInRange
                        allowDeselect= {false}
                        firstDayOfWeek={0}
                        defaultDate={form.values.date} //Automatically go to the month of current booking
                        rightSection={<i className="fa fa-calendar text-orange-600"/>}
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
                            {...form.getInputProps('start_time')}
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
                            {...form.getInputProps('end_time')}
                        />
                    </div>
                </div>
            </div>

            {/* If currentBooking is private, description will not be present. */}
            { (currentBooking?.id && currentBooking?.visbility) || !currentBooking?.id && //Booking belongs to user
             <Textarea
                 label = "Description"
                 placeholder = "Add a brief description of this booking"
                 rows={3}
                 {...form.getInputProps('title')}
             />
            }

            {/* If currentBooking is private, user information will not be present */}
            
            <div className = "lowerSection flex justify-between mt-4">
                { currentBooking?.user &&
                    //TODO: load user info here
                    <div className = "bookerInfo flex gap-3">
                        <img 
                        src = { currentBooking.user?.profileImage ?? fallbackProfileImage }
                        className = "rounded-md w-16 h-16 object-cover"
                        />
                        <div>
                            <p className = "text-neutral-400 text-sm">Booking as</p>
                            <p className = "text-orange-600 text-lg font-semibold">{currentBooking.user.first_name}</p>
                            <p className = "text-neutral-400 text-sm">{currentBooking.user.email}</p>
                        </div>
                    </div>
                }
                <div className ="flex gap-3 pt-3">
                    <button type="button" className = "p-3 text-neutral-400 rounded-md" onClick = {onClose}>Close</button>
                    { console.log(currentBooking?.user?.id, currentUser) }
                    
                    { currentBooking?.user?.id == currentUser?.id && // Booking belongs to the current user
                        <>
                            <button type="button" className ="button-orange" onClick = {() => onDelete(currentBooking)}>Delete</button>
                            <button type = "submit" className ="button-orange">Edit</button>
                        </>
                    }
                    { currentUser?.id && !currentBooking?.id &&     // Booking does not yet exist, but is being added by current user                
                        <button type = "submit" className ="button-orange">Submit</button>
                    }           
                </div>
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

        if (element1 > element2) {
          return true;
        }
        else if (element1 < element2) {
            return false; //Short circuits on hours; avoid minute-wise comparison
        }
      }
      return true; //Times are equal
    }