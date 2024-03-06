import React, { useState, useRef } from "react";
import ModalComponent from "./components/CustomModal"
import BookingListView from "./BookingList"
import BookingFormComponent from "./components/Forms/BookingForm";

import { useDisclosure } from "@mantine/hooks"
import { Modal } from "@mantine/core"
import ColumnView from "./Bookings/ColumnView.jsx";

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

	//Use this ref to handle form submission
	const formRef = useRef(null)

	const [opened, { open, close }] = useDisclosure(false);

	const [clickedBooking, setClickedBooking] = useState({})
	const [showModal, setShowModal] = useState(false)

	const onClickBooking = (bookingInfo) => {
		console.log("click")
		setClickedBooking(bookingInfo)
		open()
	}

	//Send the updated booking (not necessarily the one that was clicked)
	const onModalSubmitBooking = (bookingInfo) => {
		//TODO: Send to backend
		console.log("Submitted")
		setClickedBooking({})
		close()
	}

	const onModalCloseBooking = () => {
		setClickedBooking({})
		close()
	}


	return (
		<>
			<BookingListView displayAssets = {exampleRooms} onItemClick = {onClickBooking}/>
			{/* <ColumnView /> */}

			<Modal
				opened = {opened}
				onClose = {onModalCloseBooking}
				centered
				transitionProps = {{transition: "slide-up", duration: 200, timingFunction: "ease-in-out"}}
			>
				<BookingFormComponent currentBooking = {clickedBooking}/>
			</Modal>

		</>
	);
}

export default Bookings;
