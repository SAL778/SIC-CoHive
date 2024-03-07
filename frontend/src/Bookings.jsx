import React, { useState, useRef } from "react";
import ModalComponent from "./components/CustomModal"
import BookingListView from "./BookingList"
import BookingFormComponent from "./components/Forms/BookingForm";

import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { notifications } from '@mantine/notifications';

import ColumnView from "./Bookings/ColumnView.jsx";
import BookingHeader from "./Bookings/BookingHeader.jsx";

function Bookings() {
	const exampleRooms = [
		{
			name: "Room A",
			location: "SIC M212",
			description: "Alberta SAT Meetup",
			type: "room",
			start_time: new Date('2024-03-02T08:30:00'),
			end_time: new Date('2024-03-02T07:30:00'), 
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
			start_time: new Date('2024-03-02T08:30:00'),
			end_time: new Date('2024-03-02T07:30:00'), 
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
			start_time: new Date('2024-03-02T08:30:00'),
			end_time: new Date('2024-03-02T07:30:00'), 
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
			start_time: new Date('2024-03-02T08:30:00'),
			end_time: new Date('2024-03-02T07:30:00'), 
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
			start_time: new Date('2024-04-02T08:30:00'),
			end_time: new Date('2024-04-02T07:30:00'), 
			booker: {
				name: "Hugh Hugor",
				email: "hughhugor@ualberta.ca",
				id: 4,
			},
		},
	]

	const [opened, { open, close }] = useDisclosure(false);

	const [clickedBooking, setClickedBooking] = useState({})
 
	const onClickBooking = (bookingInfo) => {
		console.log("click")
		setClickedBooking(bookingInfo)
		open()
	}

	//Send the updated booking (not necessarily the one that was clicked)
	const onModalSubmitBooking = (bookingInfo) => {
		//TODO: Send to backend
		console.log("Submitted")
		console.dir(bookingInfo)
		notifications.show({
			autoClose: 3000,
			color: 'orange',
			title: 'Submitted Booking',
			message: 'Booking was submitted',
		  })
		setClickedBooking({})
		close()
	}

	const onModalCloseBooking = () => {
		setClickedBooking(null)
		close()
	}


	return (
		<div className="h-full overflow-clip flex-grow">
			<BookingHeader />
			
			<BookingListView displayAssets = {exampleRooms} onItemClick = {onClickBooking}/>
			{/* <ColumnView /> */}

			<Modal
				opened = {opened}
				onClose = {onModalCloseBooking}
				centered
				transitionProps = {{transition: "slide-up", duration: 200, timingFunction: "ease-in-out"}}
			>
				<BookingFormComponent 
					currentBooking = {clickedBooking}
					availableAssets = {null} //TODO: Fill this in
					onSubmit = {onModalSubmitBooking}
					onClose = {onModalCloseBooking}
				/>

			</Modal>

		</div>
	);
}

export default Bookings;
