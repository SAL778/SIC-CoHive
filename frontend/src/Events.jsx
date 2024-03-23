import React, { useEffect } from "react";
import EventsList from "./components/EventsList"; // Assuming the EventsList is in a separate file

function Events() {
	const fetchAndLogEvents = async () => {
		try {
			const icalUrl =
				"https://calendar.google.com/calendar/ical/6d3dcedc29c2a223c343cce8ec9ed5f309fd197f0805cb7f4bd79852d304d57c%40group.calendar.google.com/public/basic.ics";
			// const response = await fetch(icalUrl);
			const proxyUrl = "https://cors-anywhere.herokuapp.com/";
			const response = await fetch(proxyUrl + icalUrl);
			const data = await response.text();

			const events = parseICalData(data);
			console.log(events);
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
			location: event.LOCATION || null,
			start: parseDateTime(event.DTSTART),
			end: parseDateTime(event.DTEND),
			date: parseDayDate(event.DTSTART),
		}));
	};

	const parseDateTime = (icalDate) => {
		// Assuming the format is always like: 20240320T220000Z
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
		// Extracting and formatting the day and date
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

	useEffect(() => {
		fetchAndLogEvents();
	}, []);

	const eventsData = [
		{
			title: "SIC event",
			location: null,
			start: "3/20/2024, 4:00:00 PM",
			end: "3/20/2024, 6:00:00 PM",
			date: "Wednesday, March 20, 2024",
		},
		{
			title: "meet again test",
			location:
				"Students' Union Building\\, 8900 114 St NW\\, Edmonton\\, AB T6G 2J7\\\r\n , Canada",
			start: "3/21/2024, 1:00:00 PM",
			end: "3/21/2024, 3:00:00 PM",
			date: "Thursday, March 21, 2024",
		},
	];

	return (
		<div className="parentContainer">
			<div className="calendarContainer">
				<iframe
					src="https://embed.styledcalendar.com/#QsoYY1jHXbqoa6iOHxZi"
					title="Styled Calendar"
					className="calendarFrame styled-calendar-container"
					style={{ width: "100%", height: "1800px", border: "none" }}
					data-cy="calendar-embed-iframe"
				></iframe>
			</div>
			<div className="event-list">
				{eventsData.map((event, index) => (
					<EventsList key={index} event={event} />
				))}
			</div>
		</div>
	);
}

export default Events;
