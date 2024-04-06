import React, { useState, useContext, useEffect } from "react";
import { UserContext, HostContext } from "../../App.jsx";
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Checkbox, Select, Text } from "@mantine/core";
import { TimeInput, DatePickerInput } from "@mantine/dates";
import "./form.css";
import { httpRequest } from "../../utils.js";

export default BookingFormComponent;

/**
 * A component function that returns the render of the booking form, and handles values changes.
 * @param {Object} currentBooking - A booking object, if one exists.
 * @param {Array[Object]} availableAssets - A list of assets available to be booked
 * @param {string} type - A string that tells what type of assets were provided (i.e room, assets)
 * @param {function} onClose - A callable that triggers upon form cancellation
 * @param {function} onSubmit - A callable that triggers upon form submission
 * @param {function} onDelete - A callable that triggers upon form deletion
 */
function BookingFormComponent({
	currentBooking = null,
	availableAssets,
	onClose,
	onSubmit,
	onDelete,
	currentDate,
}) {
	const fallbackProfileImage =
		"https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
	const fallbackAssetImage =
		"https://images.unsplash.com/photo-1633633292416-1bb8e7b2832b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

	const { currentUser } = useContext(UserContext);
	const { host } = useContext(HostContext);

	//This logic is responsible for conditionally rendering the description and booker of a booked asset, based on...
	//a) Current booking already exists (i.e not being made from scratch) and is visible
	//b) Current booking does not yet exist (i.e it's being created) and thus visible to the creator
	const isShowDetails = () =>
		(currentBooking?.id && currentBooking?.visibility) || !currentBooking?.id;

	const currentUserMatchesBooking = () =>
		form?.values.user?.id == currentUser?.id;

	const interval = 15;
	const timeRange = [7, 20]; //Opening times are between 7AM and 8PM

    const allTimeSlots = getTimePeriods(interval, ...timeRange)
    //Initial booking time slots
    const [availableTimeSlots, setAvailableTimeSlots] = useState(allTimeSlots)
    //Store booked slots for faster validation
    const [disabledTimeSlots, setDisabledTimeSlots] = useState([])
    const [resourceImageSrc, setResourceImageSrc] = useState(null)

	//TODO: Change the resources ID from 1 to something else later.
	const form = useForm({
		initialValues: {
			// start and end times are split from their standard date formatting so that
			// date/time pickers are useable. They will be recombined on (valid) submit.
			id: currentBooking?.id,
			resources: currentBooking?.resources ?? "", //The ID of the resource asset for backend
			resources_name: currentBooking?.resources_name ?? "",
			//date: currentDate,
			date: !!currentBooking?.id ? currentBooking.start_time : currentDate, //Default to today
			start_time: currentBooking?.start_time
				? serializeTime(currentBooking.start_time)
				: "",
			end_time: currentBooking?.end_time
				? serializeTime(currentBooking.end_time)
				: "",
			title: currentBooking?.title ?? "",
			visibility: currentBooking?.visibility ?? true,
			user: currentBooking?.user ?? currentUser,
		},
		validate: {
			//TODO: Times between (and including) start and end cannot be booked.
			start_time: (value, values) =>
				!value
					? "Start time must be selected"
					: timeIsGreaterThan(
							deserializeTime(value),
							deserializeTime(values.end_time)
					  ) //Checks if start time exceeds end time
					? "Start time must come before the end time"
					: getTimePeriods(
							interval,
							dateToTimePeriod("T" + value),
							dateToTimePeriod("T" + values.end_time)
					  ).some((booking) => disabledTimeSlots.includes(booking)) //Check if a booked time slot falls between
					? "This room is already booked between these times"
					: null,
			end_time: (value) =>
				!value
					? "End time must be selected" //Time booked is a multiple of interval
					: null,
			name: (value) => {
				!value ? "Asset must be selected" : null;
			},
			title: (value) =>
				value.length < 50 && value.length < 1
					? "Description must between 1 and 50 characters"
					: null,
			date: (value) => {
				const today = new Date();
				today.setHours(0, 0, 0, 0); //Rewind to very beginning of the day

				return value <= today //Booking cannot be from yesterday backwards
					? "Chosen date has already passed"
					: null;
			},
		},

		//Convert the to/from dates back into ISO format
		//Exclude the intermediary value "date" from the final booking object
		transformValues: ({ date, ...values }) => {
			const transformedStart = values.start_time
				? new Date(
						date.setHours(...deserializeTime(values.start_time))
				  ).toISOString()
				: "";
			const transformedEnd = values.end_time
				? new Date(
						date.setHours(...deserializeTime(values.end_time))
				  ).toISOString()
				: "";
			return {
				...values,
				start_time: transformedStart,
				end_time: transformedEnd,
			};
		},
	});

	//This should NOT prohibit loading, but rather modify existing data when the GET goes through.
	//Gets all unique 15 minute intervals that are already booked (and therefore should be disabled)
	useEffect(() => {
		if (form?.values.resources_name) {
			const selectedAsset = availableAssets.find(
				(asset) => asset.name === form.values.resources_name
			);

            httpRequest({
                endpoint: `${host}/bookings/columns/${selectedAsset.id}/?date=${backendRepresentationOfDate(currentDate)}`,
                onSuccess: (data) => {            //Unique 15 min intervals
                    if (data.bookings)  {
                        //Update the booking image
                        setResourceImageSrc(data.image)
                        const todaysBookings = data.bookings.filter((booking) => (currentDate.getDay() === new Date(booking.start_time).getDay()));
                        const bookedTimeSlots = []
                        for (const booking of todaysBookings) {
                            let bookedTimes = getTimePeriods(interval, dateToTimePeriod(booking.start_time), dateToTimePeriod(booking.end_time));  //Booked 15 min intervals
                            console.log(booking.start_time)
                            if (selectedAsset.name == booking.resources_name && currentBooking) {
                                const validBookingTimes = new Set(
                                    getTimePeriods(interval, 
                                        dateToTimePeriod('T' + serializeTime(currentBooking.start_time)), 
                                        dateToTimePeriod('T' + serializeTime(currentBooking.end_time)))) //Timeslots taken by the item being edited.
                                bookedTimes = bookedTimes.filter(timeSlot => !validBookingTimes.has(timeSlot))
                            }
                            bookedTimeSlots.push(...bookedTimes)
                        }
                        setDisabledTimeSlots(bookedTimeSlots)           //Store for future validation
                        setAvailableTimeSlots(allTimeSlots.map((timeSlot) => (
                            bookedTimeSlots.includes(timeSlot) 
                            ? {value: timeSlot, label: timeSlot, disabled: true}
                            : {value: timeSlot, label: timeSlot, disabled: false}
                            )
                        )
                    );
                }
                }
            })
        }   
    }, [form.values.resources_name])

	return (
		// values represents the booking object
		<form
			onSubmit={form.onSubmit((values) => {
				onSubmit(values);
			})}
		>
			<div className="upperSection flex justify-between gap-4">
				<img
					src={resourceImageSrc || currentBooking?.image || fallbackAssetImage}
					className="booking-image rounded-md object-cover"
					referrerPolicy="no-referrer"
				/>
				<div className="booking-modal-options flex flex-col space-between justify-between">
					<div className="roomInfo">
						<h1 className="capitalize text-xl font-bold">
							{currentBooking?.resources_name || "Book an Asset"}
						</h1>

						{/* If currentBooking is private, description will not be present. */}
						{isShowDetails() && ( //Booking is visible
							<>
								{currentUserMatchesBooking() ? (
									<TextInput
										label="title"
										withAsterisk
										placeholder="Give your booking a title"
										rows={1}
										{...form.getInputProps("title")}
									/>
								) : (
									<Text>{form.values.title}</Text>
								)}
							</>
						)}
					</div>

					{/* TODO: The name of the room must be in available assets to appear.*/}
					{currentUserMatchesBooking() && (
						<Select
							label="Select an Asset"
							placeholder="Pick an asset"
							data={availableAssets.map((asset) => asset.name)}
							searchable
							withScrollArea={false}
							styles={{ dropdown: { maxHeight: 140, overflowY: "auto" } }}
							comboboxProps={{
								transitionProps: { transition: "skew-up", duration: 200 },
							}}
							{...form.getInputProps("resources_name")}
						/>
					)}
					<DatePickerInput
						label={isToday(form.values.date) ? "Today" : null}
						hideOutsideDates
						maxLevel="year"
						disabled={!currentUserMatchesBooking()}
						pointer="default"
						allowSingleDateInRange
						allowDeselect={false}
						firstDayOfWeek={0}
						//defaultDate={form.values.date} //Automatically go to the month of current booking
						rightSection={<i className="fa fa-calendar text-orange-600" />}
						{...form.getInputProps("date")}
						className="mt-4"
					/>

					<div className="timeSelector flex justify-between gap-3">
						<Select
							label="From"
							disabled={!currentUserMatchesBooking()}
							checkIconPosition="right"
							placeholder="from"
							// data={allTimeSlots}
							data={availableTimeSlots}
							searchable
							withAsterisk
							maxDropdownHeight={140}
							comboboxProps={{
								transitionProps: { transition: "skew-up", duration: 200 },
							}}
							{...form.getInputProps("start_time")}
						/>

						<Select
							label="To"
							disabled={!currentUserMatchesBooking()}
							checkIconPosition="right"
							placeholder="to"
							//data = {allTimeSlots}
							data={availableTimeSlots}
							searchable
							withAsterisk
							maxDropdownHeight={140}
							comboboxProps={{
								transitionProps: { transition: "skew-up", duration: 200 },
							}}
							{...form.getInputProps("end_time")}
						/>
					</div>
					{/* If the currentBooking matches the currentUser, show the visibility toggle */}
					{currentUser?.id == form?.values.user?.id && (
						<Checkbox
							label="Display booking details publicly"
							color="rgba(234, 88, 12, 1)"
							{...form.getInputProps("visibility", { type: "checkbox" })}
							className={`mt-3 ${
								form.values?.visibility
									? "text-neutral-800"
									: "text-neutral-400"
							}`}
						/>
					)}
				</div>
			</div>
			{/* If currentBooking is private, user information will not be present */}
			<div className="lowerSection flex justify-between mt-8 gap-8">
				<div className="bookerInfo flex items-center gap-3">
					{isShowDetails() && (
						//TODO: load user info here
						<>
							<img
								src={form.values?.user?.profileImage ?? fallbackProfileImage}
								className="rounded-md w-16 h-16 object-cover"
								referrerPolicy="no-referrer"
							/>
							<div className="max-w-[180px] overflow-hidden">
								<p className="text-neutral-700 text-sm truncate">
									{currentUserMatchesBooking() ? "Booking as" : "Booked by"}
								</p>
								<p className="text-orange-600 text-xl font-semibold truncate leading-[1]">
									{form.values?.user?.first_name}
								</p>
								<p className="text-neutral-400 text-sm truncate">
									{form.values?.user?.email}
								</p>
							</div>
						</>
					)}
				</div>
				<div className="flex gap-3 pt-3 justify-end">
					<button
						type="button"
						className="button-grey-hover modal-button"
						onClick={onClose}
					>
						Close
					</button>

					{currentBooking?.user?.id == currentUser?.id && ( // Booking belongs to the current user
						<>
							<button
								type="button"
								className="button-orange modal-button"
								onClick={() => onDelete(currentBooking)}
							>
								Delete
							</button>
							<button type="submit" className="button-orange modal-button">
								Edit
							</button>
						</>
					)}
					{currentUser?.id &&
						!currentBooking?.id && ( // Booking does not yet exist, but is being added by current user
							<button type="submit" className="button-orange modal-button">
								Submit
							</button>
						)}
				</div>
			</div>
		</form>
	);
}

/**
 * A function to check whether a supplied date matches today.
 * @param {Date} date - The date is to be compared to today
 * @returns {Boolean} - Whether or not the supplied date is today
 */
const isToday = (date) => {
	const today = new Date();
	return (
		date.getDay() == today.getDay() &&
		date.getMonth() == today.getMonth() &&
		date.getYear() == today.getYear()
	);
};

//Gets the time from a Date object such that it can be loaded by the Select
const serializeTime = (date) => {
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12 || 12;
	const formattedMinutes = minutes.toString().padStart(2, "0");

	//Return the formatted time
	return `${hours}:${formattedMinutes} ${ampm}`;
};

//Returns the timestring as a 24hr (hours, minutes) tuple
const deserializeTime = (timestring) => {
	// Split the time string by ':' to separate hours and minutes (12 hour format + [AP]M)
	const [time, ampm] = timestring.split(/(?=[AP]M)/i);
	const [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));

	// Convert hours to 24-hour format if necessary
	let hour24 = hours;

	if (ampm === "PM" && hours !== 12) {
		hour24 += 12;
		// Added to fix the 12AM bug where it would treat it as 24
	} else if (ampm === "AM" && hours === 24) {
		hour24 = 12;
	}

	return [hour24, minutes];
};

/** Gets the time periods between a certain time range
 *
 * @param {integer} interval - the minute intervals (e.g 15 for 15 minute gaps)
 * @param {number} startHour - A positive number that represents the start time in 24 hour format (e.g 8.5 = 8:30 AM)
 * @param {number} endHour - A positive number that represents the start time in 24 hour format (e.g 15.5 = 3:30 PM)
 * @see dateToHoursFloat - A helper function that can be used for date conversion.
 *
 *
 * @returns - An array of intervals, bookended by the start hour and end hour inclusive.
 */

const getTimePeriods = (interval, startHour, endHour) => {
	const periods = [];

	// Loop through each interval
	for (let i = startHour * 60; i <= endHour * 60; i += interval) {
		// Convert current interval to hours and minutes
		let hours = Math.floor(i / 60);
		const minutes = i % 60 === 0 ? "00" : i % 60; // Adjusted for 15-minute intervals

		// Determine AM/PM
		const ampm = hours >= 12 ? "PM" : "AM";

		// Convert to 12-hour format
		hours = hours % 12 || 12;
		const formattedMinutes = minutes.toString().padStart(2, "0");

		// Add formatted time period to periods array
		periods.push(`${hours}:${formattedMinutes} ${ampm}`);
	}

	return periods;
};

/** Distills a date down to its hour/minute components, and returns it as a 24 hour float
 *  @param {date} date - a date object
 *  @param {string} date - a string representing the date convertable to a date object
 *  @param {[hours, minutes]} date - An array representing the times as an hour minute array.
 *  @see getTimePeriods - The function that consumes time periods as arguments.
 *
 *
 *  @returns hours, minutes
 */
const dateToTimePeriod = (date) => {
	let transformed = date;
	//Convert dates to ISO strings, then isolate hours, minutes
	if (transformed instanceof Date) {
		transformed = date.toISOString();
		console.log("was date" + transformed);
	}
	//Then convert this ISO string to an array
	if (typeof transformed == "string") {
		transformed = deserializeTime(transformed.split("T")[1]);
	}
	//Finally, convert the date to its 24 hours representation
	const [hours, minutes] = transformed;
	const hoursRep = hours + minutes / 60;

	return hoursRep; //The final representation of a timeperiod
};

//Does an int-wise comparison of deserialized time (standard > symbol compares them as strings)
//which causes 1x < y (where y is a single digit (AM))
const timeIsGreaterThan = (deserializedTime1, deserializedTime2) => {
	for (let i = 0; i < deserializedTime1.length; i++) {
		// Convert elements to integers before comparison
		const element1 = parseInt(deserializedTime1[i]);
		const element2 = parseInt(deserializedTime2[i]);

		if (element1 > element2) {
			return true;
		} else if (element1 < element2) {
			return false; //Short circuits on hours; avoid minute-wise comparison
		}
	}
	return true; //Times are equal
};

const backendRepresentationOfDate = (rawDate) => {
	// Given date string
	const dateString = rawDate;

	// Create a new Date object from the given string
	const date = new Date(dateString);

	// Extract year, month, and day from the Date object
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 to month because month index starts from 0
	const day = ("0" + date.getDate()).slice(-2);

	// Construct the year-month-day format string
	const formattedDate = year + "-" + month + "-" + day;

	// Output the result
	return formattedDate;
};
