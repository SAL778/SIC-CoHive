import React from "react";
import BookingListView from "./BookingList"

function Bookings() {

	const exampleRooms = [
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
		},
		{
			name: "Art Workstation 2",
			type: "room",
			location: "SIC M975",
			description: "Logo Design for StartupAB",
			to: new Date('2024-04-02T08:30:00'),
			from: new Date('2024-04-02T07:30:00'), 
			booker: {
				name: "Hugh Hugor",
				email: "hughhugor@ualberta.ca",
				id: 4,
			},
		},
	]

	return (
		<BookingListView displayAssets = {exampleRooms}/>
	);
}

export default Bookings;
