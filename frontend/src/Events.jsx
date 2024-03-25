import React, { useState, useEffect, useContext } from "react";
import EventsList from "./components/EventsList";
import DateSelector from "./components/DateSelector";
import  EventsCarousel from "./EventsPage/EventsCarousel.jsx";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HostContext } from "./App";
import { httpRequest } from "./utils";

function Events() {

	const fallbackImage = "https://www.ualberta.ca/science/media-library/news/2018/sep/student-innovation-centre-launch.jpg";

	const [currentDate, setCurrentDate] = useState(new Date());
	const [eventsData, setEventsData] = useState([]);
	const [events, setEvents] = useState([]);				//Populates carousel
	const [isLoading, setIsLoading] = useState(true);
	const { host } = useContext(HostContext);
	const [opened, {open, close}] = useDisclosure(false);	//Used for modal control
	const [clickedEvent, setClickedEvent] = useState(null);			//Populates modal
	
    const modalClose = () => {
        close()
        setTimeout(() => {
            setClickedEvent(null)
        }, 200);
    }

	const fetchEvents = async (selectedDate) => {
		try {
			const icalUrl =
				"https://calendar.google.com/calendar/ical/6d3dcedc29c2a223c343cce8ec9ed5f309fd197f0805cb7f4bd79852d304d57c%40group.calendar.google.com/public/basic.ics";
			// const response = await fetch(icalUrl);
			const proxyUrl = "https://cors-anywhere.herokuapp.com/";
			const response = await fetch(proxyUrl + icalUrl);
			const data = await response.text();

			const events = parseICalData(data);
			// Filter events for the selected date
			const filteredEvents = events.filter((event) =>
				isSameDay(new Date(event.start), selectedDate)
			);
			setEventsData(filteredEvents);
		} catch (error) {
			console.error("Failed to fetch events:", error);
		}
	};

	const parseICalData = (data) => {
		const eventRegex = /BEGIN:VEVENT(.+?)END:VEVENT/gs;
		// const detailRegex = /(SUMMARY|DTSTART|DTEND|LOCATION):(.+)/g;
		const detailRegex =
			/(SUMMARY|DTSTART|DTEND|LOCATION):([\s\S]*?)(?=(?:\r?\n[A-Z]+:|\r?\n$))/g;
		const events = [];

		let eventMatch;
		while ((eventMatch = eventRegex.exec(data)) !== null) {
			const eventDetails = {};
			let detailMatch;
			while ((detailMatch = detailRegex.exec(eventMatch[1])) !== null) {
				eventDetails[detailMatch[1]] = detailMatch[2];
			}
			events.push(eventDetails);
		}

		return events.map((event) => ({
			title: event.SUMMARY,
			location: event.LOCATION ? event.LOCATION.split("\\")[0] : null, // only the building name or null
			start: parseDateTime(event.DTSTART),
			end: parseDateTime(event.DTEND),
			date: parseDayDate(event.DTSTART),
		}));
	};

	const parseDateTime = (icalDate) => {
		// format: 20240320T220000Z
		const date = new Date(
			icalDate.substring(0, 4) +
				"-" +
				icalDate.substring(4, 6) +
				"-" +
				icalDate.substring(6, 11) +
				":" +
				icalDate.substring(11, 13) +
				":" +
				icalDate.substring(13, 15) +
				"Z"
		);
		// return date.toISOString();
		return date.toLocaleString("en-US", { timeZone: "America/Edmonton" });
	};

	const parseDayDate = (icalDate) => {
		const date = new Date(
			icalDate.substring(0, 4) +
				"-" +
				icalDate.substring(4, 6) +
				"-" +
				icalDate.substring(6, 11) +
				":" +
				icalDate.substring(11, 13) +
				":" +
				icalDate.substring(13, 15) +
				"Z"
		);
		return date.toLocaleDateString("en-US", {
			timeZone: "America/Edmonton",
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const isSameDay = (date1, date2) => {
		return (
			date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear()
		);
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
				setEvents(eventData.events)
				setIsLoading(false)
			}
		})
	}, []);


	return (
		<div className="parent-container-events content-container max-w-[1600px] mx-auto px-[10px] pb-[10px] overflow-hidden">
			<h1 class="text-orange-600 text-3xl font-bold mb-2">Upcoming Events</h1>
			{ !isLoading && 
				<EventsCarousel 
					events={events} 
					onItemClick={(event) => {
						setClickedEvent(event)
						open()
					}}
				/>
			}
			<div className="calendarContainer">
				<iframe
					src="https://embed.styledcalendar.com/#QsoYY1jHXbqoa6iOHxZi"
					title="Styled Calendar"
					className="calendarFrame styled-calendar-container"
					style={{ width: "100%", height: "675px", border: "none" }}
					data-cy="calendar-embed-iframe"
				></iframe>
			</div>

			<div className="w-fit min-w-[300px]">
				<DateSelector onSetDate={handleDateChange} currentDate={currentDate}/>
			</div>
			<div className="flex flex-col gap-4 event-list mt-[14px]">
				{eventsData.map((event, index) => (
					<EventsList key={index} event={event} />
				))}
			</div>

			<Modal
				opened={opened}
				onClose={modalClose}
				centered
				size="1200px"
				transitionProps={{
					transition: "slide-up",
					duration: 200,
					timingFunction: "ease-in-out",
				}}
			>
				<div className="eventModal modalContent h-full min-h-[40vh] w-full flex">

					<div className="leftSide basis-1/2">
						<div className="image-overlay absolute top-0 left-0 w-1/2 h-full">
							<img
								src={properImageSource(clickedEvent?.imgSrc) || fallbackImage}
								// Placeholder image for testing and broke image issue
								// src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDD0mkEw4XGHCeOLfDy4X-w3M_12FIJJ9x1fNsYzZBD5vAC_Nppn4uPAWtHNNHMvno6aRYMrq8PAiq95D0WXNXNA6t_T5z2sFaeo7BHxdE-L44QACEDNOQ5jDO7_tP1QthkF_hVvX9gact/s400/Makemake+moon+-+Hubble+NASA.jpg"
								className="object-cover w-full h-full"
							/>
						</div>
					</div>

					<div className="rightSide basis-1/2 pl-4 flex flex-col justify-between">
						<div className = "textContent">
							<h2 style={{
								fontSize: "26px",
								fontWeight: 600,
								marginBottom: "20px",
							}}>
								{clickedEvent?.title}
							</h2>
							<section className="eventDetails grid grid-cols-2 gap-4 text-[16px]">
								<p className="location"><i className="fa text-center w-[20px] mr-3 fa-location-dot"/>{clickedEvent?.location}</p>
								<p className="date"><i className="fa text-center w-[20px] mr-3 fa-calendar-day"/>{clickedEvent?.date}</p>
								<p className="organizer"><i className="fa text-center w-[20px] mr-3 fa-user-group"/>{clickedEvent?.email}</p>
								<p className="time"><i className="fa text-center w-[20px] mr-3 fa-clock"/>{clickedEvent?.startTime} - {clickedEvent?.endTime}</p>
							</section>
							<p className="mt-10">{clickedEvent?.description}</p>
						</div>
						<div className = "buttonFooter ml-auto">
							<button onClick = {modalClose} className="button-orange modal-button flex-end">Close</button>
						</div>
					</div>		
				</div>
			</Modal>
		</div>
	);
}

//Change this so the link isn't broken
function properImageSource(url) {
	const pattern = /id=([\w-]+)/;  //Extract the ID from the imageURL

	const match = url?.match(pattern);
	const imageId = match ? match[1] : null;
	const newUrl = imageId ? `https://drive.google.com/thumbnail?id=${imageId}` : null;

	return (newUrl)
}

export default Events;
