import React from "react";
import MantineCarousel from "./Carousel/MantineCarousel.jsx";
import { genHexColor } from "../utils.js";
import fallbackImage from "../assets/event_background.jpg";

export default EventsCarousel;

/**Renders the events carousel
 *
 * @param {Array} events: The events to render within the carousel
 * @param {function} onItemClick: To be triggered when a carousel item is clicked on.
 * @returns {JSX.Element}
 */
function EventsCarousel({ events, onItemClick }) {
	return (
		<MantineCarousel>
			{events.map((event, index) => (
				<EventCard
					key={index}
					event={event}
					onClick={() => onItemClick(event)}
				/>
			))}
		</MantineCarousel>
	);
}

//The JSX Render of an event
function EventCard({ event, onClick }) {
	const formatDate = (dateString) => {
		// Parse the date string
		//"2024-05-02T13:00:00-06:00"
		const [year, monthStr, day] = dateString.split("T")[0].split("-");
		const month = parseInt(monthStr, 10);

		// Define an array of month abbreviations
		const monthAbbreviations = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		// Get the three-letter abbreviation of the month
		const monthAbbreviation = monthAbbreviations[month - 1];

		// Create a formatted date string with the expanded month
		return `${monthAbbreviation} ${day}, ${year}`;
	};

	return (
		<div
			onClick={() => onClick(event)}
			className="event-card relative group overflow-hidden p-5 rounded-[12px] h-72 w-56 flex flex-col place-content-between ease-out duration-200 shadow-custom hover:cursor-pointer"
		>
			<img
				src={properImageSource(event.imgSrc) || fallbackImage}
				alt={event.summary}
				className="absolute inset-0 w-full h-full transition object-cover duration-500 ease-in-out group-hover:scale-110 z-0"
				referrerPolicy="no-referrer"
			/>

			<div className="cardContent relative flex flex-col h-full justify-between z-10 text-white">
				<h2 className="title flex items-start text-lg font-medium tracking-wider">
					<i
						style={{ backgroundColor: genHexColor(event.summary) }}
						className="w-5 min-w-5 h-5 rounded-full inline-block mt-1 mr-3"
					/>
					{event.summary}
				</h2>

				<div className="locationTimeSection flex flex-col gap-2">
					<span className="eventLocation block">
						<i className="fa fa-location-dot text-white mr-3 text-lg w-[20px]" />
						<p className="inline">
							{event.location.startsWith("https") ? "REMOTE" : event.location}
						</p>
					</span>
					<span className="eventTime block">
						<i className="fa fa-clock text-white mr-3 text-lg w-[20px]" />
						<p className="inline">{formatDate(event.start.dateTime)}</p>
					</span>
					<i className="fa fa-arrow-right ml-auto mt-4" />
				</div>
			</div>
		</div>
	);
}

function properImageSource(url) {
	const pattern = /id=([\w-]+)/; //Extract the ID from the imageURL

	const match = url?.match(pattern);
	const imageId = match ? match[1] : null;

	const newUrl = imageId
		? `https://drive.google.com/thumbnail?id=${imageId}`
		: null;

	return newUrl;
}
