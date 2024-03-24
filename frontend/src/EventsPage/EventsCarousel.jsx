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
        style = {{backgroundImage: `url(${properImageSource(event.imgSrc)})`}}
		className={`eventCard bg-white rounded-md brightness-50 display-flex flex-col justify-content-between`}>
			<h2>
                <i style = { {color: "`${genHexColor(event.title)}`" } } className = "w-5 h-5"/>
                {event.title}
            </h2>
            {console.log(properImageSource(event.imgSrc))}

			<div className="locationTimeSection">
				<span className = "eventLocation block">
					<i className="fa fa-location-arrow text-white"/>
					<p>{event?.location}</p>
				</span>
				<span className = "eventTime block">
					<i className="fa fa-clock text-white"/>
					<p>{event.startTime} - {event.endTime}</p>
				</span>
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

