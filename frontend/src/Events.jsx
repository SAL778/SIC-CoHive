import React, { useState, useEffect, useContext } from "react";
import EventsList from "./components/EventsList";
import DateSelector from "./components/DateSelector";
import EventsCarousel from "./components/EventsCarousel.jsx";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HostContext } from "./App";
import { httpRequest } from "./utils";
import { convert } from "html-to-text";

function Events() {
	const fallbackImage =
		"https://www.ualberta.ca/science/media-library/news/2018/sep/student-innovation-centre-launch.jpg";

	const googleCalendar = JSON.parse(localStorage.getItem("appLinks"))[0]
		.google_calendar_link;
	const eventFormLink = JSON.parse(localStorage.getItem("appLinks"))[0]
		.event_submission_form_link;

	const [currentDate, setCurrentDate] = useState(new Date());
	const [eventsData, setEventsData] = useState([]);
	const [events, setEvents] = useState([]); //Populates carousel
	const [isLoading, setIsLoading] = useState(true);
	const { host } = useContext(HostContext);
	const [opened, { open, close }] = useDisclosure(false); //Used for modal control
	const [clickedEvent, setClickedEvent] = useState(null); //Populates modal

	const modalClose = () => {
		close();
		setTimeout(() => {
			setClickedEvent(null);
		}, 200);
	};

	const fetchEvents = async (selectedDate) => {
		try {
			const formattedDate = selectedDate.toISOString().split("T")[0];
			const response = await fetch(
				`${host}/google_drive_integration/calendar-events?date=${formattedDate}`
			);
			const jsonResponse = await response.json();

			const eventsData = jsonResponse.events;
			// Filter events for the selected date
			const filteredEvents = eventsData.filter((event) => {
				const eventStartDate = new Date(event.start);
				return isSameDay(eventStartDate, selectedDate);
			});

			setEventsData(filteredEvents);
			console.log("Events data:", eventsData);
			console.log("Filtered events:", filteredEvents);
		} catch (error) {
			console.error("Failed to fetch events:", error);
		}
	};

	const isSameDay = (date1, date2) => {
		return (
			date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear()
		);
	};

	// // Get the time without seconds for the modal
	// const removeSeconds = (timeString) => {
	// 	if (timeString) {
	// 		const [hours, minutes, seconds_period] = timeString.split(":");
	// 		const period = seconds_period.split(" ")[1];
	// 		return `${hours}:${minutes} ${period}`;
	// 	}
	// 	return "";
	// };

	const removeSeconds = (dateTimeString) => {
		if (dateTimeString) {
			const date = new Date(dateTimeString);
			const hours = date.getHours().toString().padStart(2, "0");
			const minutes = date.getMinutes().toString().padStart(2, "0");
			return `${hours}:${minutes}`;
		}
		return "";
	};

	const handleDateChange = (selectedDate) => {
		setCurrentDate(selectedDate);
		fetchEvents(selectedDate);
	};

	useEffect(() => {
		fetchEvents(currentDate);
		httpRequest({
			endpoint: `${host}/google_drive_integration/events`,
			onSuccess: (eventData) => {
				console.log("Event data:", eventData);
				setEvents(eventData.events);
				setIsLoading(false);
			},
		});
	}, []);

	return (
		<div className="parent-container-events content-container max-w-[1600px] mx-auto px-[10px] pb-[10px] overflow-hidden">
			<h1 className="text-orange-600 text-3xl font-bold mb-2">
				Upcoming Events
			</h1>
			{!isLoading && events.length ? (
				<EventsCarousel
					events={events}
					onItemClick={(event) => {
						setClickedEvent(event);
						open();
					}}
				/>
			) : (
				<p> No Upcoming Events in the next 2 weeks! Check back soon</p>
			)}
			<button
				type="button"
				onClick={() => {
					window.open(`${eventFormLink}`, "_blank");
				}}
				className="button-orange button-wide mt-[30px] h-[64px]"
			>
				Submit an Event
			</button>
			<div className="calendarContainer">
				<iframe
					src={googleCalendar}
					title="Styled Calendar"
					className="calendarFrame styled-calendar-container"
					style={{ width: "100%", height: "695px", border: "none" }}
					data-cy="calendar-embed-iframe"
				></iframe>
			</div>

			<div className="w-fit min-w-[300px]">
				<DateSelector onSetDate={handleDateChange} currentDate={currentDate} />
			</div>
			<div className="flex flex-col gap-4 event-list mt-[14px]">
				{eventsData.map((event, index) => (
					<EventsList
						key={index}
						event={event}
						onItemClick={(event) => {
							setClickedEvent(convertCalendarEvent(event));
							open();
						}}
					/>
				))}
			</div>

			<Modal
				opened={opened}
				onClose={modalClose}
				centered
				size="1000px"
				transitionProps={{
					transition: "slide-up",
					duration: 200,
					timingFunction: "ease-in-out",
				}}
			>
				<div className="eventModal modalContent h-full min-h-[40vh] w-full flex">
					<div className="leftSide basis-1/2">
						<div className="image-overlay relative w-full h-full rounded-md overflow-hidden">
							<img
								src={properImageSource(clickedEvent?.imgSrc) || fallbackImage}
								className="w-full h-full rounded-md object-cover"
								referrerPolicy="no-referrer"
							/>
						</div>
					</div>

					<div className="rightSide basis-1/2 flex flex-col justify-between gap-8">
						<div className="textContent">
							<h2
								style={{
									fontSize: "26px",
									fontWeight: 600,
									marginBottom: "20px",
								}}
							>
								{clickedEvent?.title}
							</h2>
							<section className="eventDetails grid gap-4 text-[16px]">
								<p className="location">
									<i className="fa text-center w-[20px] mr-3 fa-location-dot" />
									{clickedEvent?.location.startsWith("https") ? (
										<a
											href={clickedEvent?.location}
											className="underline text-blue-400"
											target="_blank"
										>
											{clickedEvent?.location}
										</a>
									) : (
										clickedEvent?.location
									)}
								</p>
								<p className="date">
									<i className="fa text-center w-[20px] mr-3 fa-calendar-day" />
									{clickedEvent?.start.dateTime.split("T")[0]}
								</p>
								<p className="organizer">
									<i className="fa text-center w-[20px] mr-3 fa-user-group" />
									{clickedEvent?.creator.email}
								</p>
								<p className="time">
									<i className="fa text-center w-[20px] mr-3 fa-clock" />
									{removeSeconds(clickedEvent?.start.dateTime)} -{" "}
									{removeSeconds(clickedEvent?.end.dateTime)}
								</p>
							</section>
							<p className="mt-10">{convert(clickedEvent?.description)}</p>
						</div>
						<div className="buttonFooter ml-auto">
							<button
								onClick={modalClose}
								className="button-orange modal-button flex-end"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}

//Change this so the link isn't broken
function properImageSource(url) {
	const pattern = /id=([\w-]+)/; //Extract the ID from the imageURL

	const match = url?.match(pattern);
	const imageId = match ? match[1] : null;
	const newUrl = imageId
		? `https://drive.google.com/thumbnail?id=${imageId}`
		: null;

	return newUrl;
}

//Parse the calendar info to that expected by the modal.
function convertCalendarEvent(event) {
	const fallbackValue = "N/A";
	return {
		title: event.summary !== "" ? event.summary : fallbackValue,
		location: event.location !== "" ? event.location : fallbackValue,
		description:
			event.description !== "" ? event.description : "No event description",
		creator: {
			email: event.email,
		},
		// date: parseDate(event.start, "date"),
		// startTime: parseDate(event.start, "time"),
		// endTime: parseDate(event.end, "time"),
		// date: event.start.split("T")[0],
		// startTime: event.start.split("T")[0],
		// endTime: event.end.split("T")[0],
		start: {
			dateTime: event.start,
		},
		end: {
			dateTime: event.end,
		},
	};
}

/** Convert the time in a calendar event to the format expected by the modal.
 *  Helper for convertCalendarEvent
 * 	@param {string} dateStr: The date string
 *  @param {str} output: Either "date" or "time"
 *  @returns string: Either the formatted date (M/D/Y) or time in 12H format if "time"
 *  @see convertCalendarEvent
 */
const parseDate = (dateStr, output = "date") => {
	//The date string provided by iCal isn't a valid Date constructor, so I have to use regex to pull out the times
	//Parsing dates makes me so depressed man we should've just used a library like moment if only we knew earlier :(

	//start:"2024-05-02T13:00:00-06:00"
	//end: "2024-05-02T6:00"

	//Break the string apart
	const rePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
	const match = dateStr.match(rePattern);
	const [, year, month, day, hours, minutes] = match;

	if (output == "date") {
		return `${month}/${day}/${year}`;
	} else {
		const isPm = parseInt(hours) >= 12;
		const formattedHours = parseInt(hours) % 12 || 12;

		return `${formattedHours}:${minutes} ${isPm ? "PM" : "AM"}`;
	}
};

export default Events;
