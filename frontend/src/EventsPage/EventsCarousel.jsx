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
            {events.map(event => {
                EventCard(event, onClick = onItemClick)
            })}
        </MantineCarousel>
    )
}

//The JSX Render of an event
function EventCard({event, onClick}) {
	return (
		<div
		onClick = {() => onClick(event)}
		className={`eventCard bg-white rounded-md bg-image:url(${event.imgSrc} brightness-50) display-flex flex-col justify-content-between`}>
			<h2>
                <i style = {`${genHexColor(event.title)}`} className = "w-5 h-5"/>
                {event.title}
            </h2>

			<div className="locationTimeSection">
				<span className = "eventLocation block">
					<i className="fa fa-location-arrow text-white"/>
					<p>{event.location}</p>
				</span>
				<span className = "eventTime block">
					<i className="fa fa-clock text-white"/>
					<p>{event.startTime} - {event.endTime}</p>
				</span>
			</div>
		</div>
	)
}

