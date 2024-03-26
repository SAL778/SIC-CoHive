import React from "react";
import MantineCarousel from "../components/Carousel/MantineCarousel.jsx";
import { genHexColor } from "../utils.js"

export default EventsCarousel

/**Renders the events carousel
 * 
 * @param {Array} events: The events to render within the carousel
 * @param {function} onItemClick: To be triggered when a carousel item is clicked on.
 * @returns {JSX.Element}
 */
function EventsCarousel({events, onItemClick}) {
    return (
        <MantineCarousel>
            {events.map((event, index) => (
                <EventCard key = {index} event = {event} onClick = {onItemClick}/>
            ))}
        </MantineCarousel>
    )
}

//The JSX Render of an event
function EventCard({event, onClick}) {

    const formatDate = (dateString) => {
        // Parse the date string
        const [monthStr, day, year] = dateString.split('/');
        const month = parseInt(monthStr, 10);

        // Define an array of month abbreviations
        const monthAbbreviations = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Get the three-letter abbreviation of the month
        const monthAbbreviation = monthAbbreviations[month - 1];

        // Create a formatted date string with the expanded month
        return `${monthAbbreviation} ${day}, ${year}`;
    };

	return (
            <div
            onClick = {() => onClick(event)}
            className="event-card relative group overflow-hidden p-5 rounded-[12px] h-72 w-56 flex flex-col place-content-between ease-out duration-200 shadow-custom hover:cursor-pointer"
            >
                <img 
                src = {properImageSource(event.imgSrc)}
                // Placeholder image for testing and broke image issue
                // src = "https://png.pngtree.com/png-vector/20191126/ourmid/pngtree-image-of-cute-radish-vector-or-color-illustration-png-image_2040180.jpg"
                alt = {event.title}
                className = "absolute inset-0 w-full h-full transition object-cover duration-500 ease-in-out group-hover:scale-110 z-0"
                />

                <div className="cardContent relative flex flex-col h-full justify-between z-10 text-white">
                    <h2 className = "title flex items-start text-lg font-medium">
                        <i style = {{backgroundColor: genHexColor(event.title) }} className = "w-5 min-w-5 h-5 rounded-full inline-block mt-1 mr-3"/>
                        {event.title}
                    </h2>

                    <div className="locationTimeSection flex flex-col gap-2">
                        <span className = "eventLocation block">
                            <i className= "fa fa-location-dot text-white mr-3 text-lg w-[20px]"/>
                            <p className= "inline">{event.location}</p>
                        </span>
                        <span className = "eventTime block">
                            <i className= "fa fa-clock text-white mr-3 text-lg w-[20px]"/>
                            {/* <p className= "inline">{event.startTime} - {event.endTime}</p> */}
                            <p className="inline">{formatDate(event.date)}</p>
                        </span>
                        <i className="fa fa-arrow-right ml-auto mt-4"/>
                    </div>
                </div>
            </div>
	)
}

function properImageSource(url) {
	const pattern = /id=([\w-]+)/;  //Extract the ID from the imageURL

	const match = url?.match(pattern);
	const imageId = match ? match[1] : null;

	const newUrl = imageId ? `https://drive.google.com/thumbnail?id=${imageId}` : null;
	
	return (newUrl)
}

