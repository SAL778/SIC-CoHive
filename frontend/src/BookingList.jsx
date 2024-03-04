import React, { useState, useEffect, useContext } from "react";
import Filter from "./components/Filter.jsx";
import { HostContext, UserContext } from "./App.jsx";
import { getCookieValue } from "./utils.js";

const exampleItems = [
    {
        name: "Upper Floor Workshop Area",
        location: "SIC M212",
        description: "Alberta SAT Meetup",
        type: "room",
        to: new Date('2024-03-02T08:30:00'),
        from: new Date('2024-03-02T07:30:00'), 
        booker: {
            name: "Really Long Name Here",
            email: "short@email.here",
            id: 1,
            },
        private: false
    },
    {
        name: "Single Loop Study Space",
        location: "SIC M215",
        type: "room",
        description: "Hello World",
        to: new Date('2024-03-02T08:30:00'),
        from: new Date('2024-03-02T07:30:00'), 
        booker: {
            name: "Lawrence J",
            email: "lawj@email.here",
            id: 3,
            },
        private: false
    },
    {
        name: "Conference Room A",
        type: "room",
        location: "SIC M073",
        description: "Meeting with key shareholders",
        to: new Date('2024-03-02T08:30:00'),
        from: new Date('2024-03-02T07:30:00'), 
        booker: {
            name: "Hugh Hugor",
            email: "hughhugor@ualberta.ca",
            id: 4,
            },
        private: false
    },
    {
        name: "Art Workstation 2",
        type: "room",
        location: "SIC M875",
        description: "Logo Design for StartupAB",
        to: new Date('2024-03-02T08:30:00'),
        from: new Date('2024-03-02T07:30:00'), 
        booker: {
            name: "Hugh Hugor",
            email: "hughhugor@ualberta.ca",
            id: 4,
        },
        private: false
    },
]

/**
 * A component that returns the render of a list view.
 * @param {function} onItemClick - Callback for what to do when an item is clicked on (i.e. open modal)
 * @param {Array[Object]} displayAssets - An array of javascript objects that represent each item (i.e. Room or equipment)
 */
function BookingListView({onItemClick, displayAssets}) {
    const dateHeaders = getUniqueDateHeaders(displayAssets.map(asset => asset.from))
     
    return (
        <ul>
            {dateHeaders.map(dateHeader => (
                <li key={dateHeader}>
                    <DateHeaderComponent date = {dateHeader}/>
                    <ul>
                        {displayAssets
                            .filter(asset => asset.from.getDay() === dateHeader.getDay())
                            .map(asset => (
                                <AssetComponent key={asset.id} asset={asset} onItemClick={onItemClick} />
                            ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}

/**
 * A component that returns the render of a list item to be displayed.
 * @param {Object} asset - The object representation of an asset (room or equipment)
 */
function AssetComponent({asset}) {

    const { currentUser } = useContext(UserContext);

    const greyOut = ( asset.private && currentUser.id != asset.booker.id )

    //Convert AM/PM date
    const formatTime= (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();

        //Convert to 24 Hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; //Handle midnight

        //Pad minutes with zeroes if needed
        minutes = minutes >= 10 ? minutes : '0' + minutes ;

        //Formatted Time
        return (`${hours}:${minutes} ${ampm}`);
    }

    return (
        //TODO: On private, grey everything out
        <div className = {greyOut && "greyed-out"}>
            <div>
                <h3>{asset.name}</h3>
                <p>{asset.description}</p>
            </div>

            { asset.type == "location" &&
             <div>
                <i className = "fa fa-location"/>
                <p>{asset.location}</p>
             </div>
            }
            
            <div>
                <i className = "fa fa-calendar"/>
                <p>
                    {asset.from.toLocaleString('en-us', {weekday:'long'})}
                    {asset.from.toLocaleString('en-us', {month:'short'})}
                    {asset.from.getDate()}
                </p>
                <p>{formatTime(asset.from)} - {formatTime(asset.to)}</p>
            </div>

            { !greyOut &&
             <div>
                {/* Booker not present on private posts */}
                <p>{asset.booker?.name}</p>
                <p>{asset.booker?.email}</p>
             </div>
            }
        </div>
    )
}

/**
 * A component that returns the renders of a date header
 * @param {Date} - The date to be rendered
 * TODO: Style
 */
function DateHeaderComponent({date}) {
    return (
        <>
            <h2>{date.toLocaleString('en-us', {weekday:'long'})}</h2>
            <div>
                <h3>{date.toLocaleString('default', { month: 'long' })} {date.getDate()}</h3>
                <h3>{date.getYear() + 1900}</h3> {/* getYear() returns years since 1900 */}
            </div>
            <hr/>
        </>
    )
}

/**
 * A function that returns all of the date headers to show from the list of display items.
 * Dates without any booked slots will not be displayed.
 * @param {Array[Date]} dates - An array of booking dates, including time
 * @returns {Array[Date]} - An array of unique dates without considering time
 */
const getUniqueDateHeaders = (dates) => {
    const uniqueDates = [];
    const serialized = new Set(); //Used to hold the date string to avoid reference comparison
    
    dates.forEach(date => {
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (!serialized.has(newDate.toString())) {
            serialized.add(newDate.toString())
            uniqueDates.push(newDate)           //Date object so that Date-methods can still be used.
        }        
    });

    return uniqueDates;
};

export default BookingListView