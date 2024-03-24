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
	return (
            <div
            onClick = {() => onClick(event)}
            className="eventCard relative w-256 overflow-hidden group rounded-md p-3 bg-neutral-500 shadow-custom cursor-pointer"
            >
                <img 
                src = {properImageSource(event.imgSrc)}
                alt = {event.title}
                className = "absolute inset-0 w-full h-full transition object-cover duration-500 ease-in-out group-hover:scale-110 brightness-50 z-0"
                />

                <div className="cardContent relative flex flex-col justify-content-between z-10 text-white gap-16">
                    <h2 className = "title flex items-center text-lg font-medium">
                        <i style = {{backgroundColor: genHexColor(event.title) }} className = "w-5 h-5 rounded-full inline-block mr-3"/>
                        {event.title}
                    </h2>

                    <div className="locationTimeSection flex flex-col gap-2">
                        <span className = "eventLocation block">
                            <i className= "fa fa-location-dot text-white mr-3 text-lg"/>
                            <p className= "inline">{event.location}</p>
                        </span>
                        <span className = "eventTime block">
                            <i className= "fa fa-clock text-white mr-3 text-lg"/>
                            <p className= "inline">{event.startTime} - {event.endTime}</p>
                        </span>
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
	if (match) {
		console.log(newUrl)
	}
		
	return (newUrl)
}

