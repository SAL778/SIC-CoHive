import React, { useState, useRef, useContext } from "react";
import { HostContext, UserContext } from "./App.jsx";

import ModalComponent from "./components/CustomModal"
import BookingListView from "./Bookings/BookingList.jsx"
import BookingFormComponent from "./components/Forms/BookingForm";
import { ErrorNotification, SuccessNotification } from "./components/notificationFunctions.js";

import { useDisclosure } from "@mantine/hooks";	
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import ColumnView from "./Bookings/BookingColumnView.jsx";
import BookingHeader from "./Bookings/BookingHeader.jsx";
import { httpRequest } from "./utils.js";

// import { checkUserLoggedIn } from "./utils.js";

function Bookings() {
	// checkUserLoggedIn();

	const { host } = useContext(HostContext)
	const { currentUser } =  useContext(UserContext);

	const [opened, { open, close }] = useDisclosure(false);

	const [clickedBooking, setClickedBooking] = useState(null);
	const [isColumnView, setIsColumnView] = useState(true);

	const onClickBooking = (bookingInfo) => {
		console.log("click");
		setClickedBooking(bookingInfo);
		open();
	};

	//Send the updated booking (not necessarily the one that was clicked)
	const onModalSubmitBooking = (bookingInfo) => {
		//If bookingInfo has an ID, it is a PATCH (frontend doesn't assign this)
		if (!!bookingInfo.id) {
			httpRequest({
				endpoint: `${host}/bookings/${bookingInfo.id}/`,
				method: "PATCH",
				body: JSON.stringify(bookingInfo),
				onSuccess: () => {
					console.log("Success")
					new SuccessNotification("Booking modified", `${bookingInfo.resource_name} was succesfully edited!`).show()
				},
				onFailure: () => {
					console.log("Fail")
					console.dir(bookingInfo)
					new ErrorNotification("Booking couldn't be modified", `${bookingInfo.resource_name} couldn't be booked`).show()
				}
			})
		}
		//New booking posted
		else {
			httpRequest({
				endpoint: `${host}/bookings/user/${currentUser.id}/`,
				method: "POST",
				body: JSON.stringify(bookingInfo),
				onSuccess: () => {
					console.log("Success")
					new SuccessNotification("Booking added", `${bookingInfo.resource_name} was succesfully booked!`).show()
				},
				onFailure: () => {
					console.log("Fail")
					console.dir(bookingInfo)
					new ErrorNotification("Booking couldn't be added", `${bookingInfo.resource_name} couldn't be booked`).show()
				}
			})
		}
		setClickedBooking(null)
		close()
	}

	const onModalCloseBooking = () => {
		setClickedBooking(null);
		close();
	};

	return (
		<div className="h-full overflow-clip flex-grow">
			<BookingHeader setColumnView={setIsColumnView} />

			{!isColumnView ? (
				<BookingListView onItemClick={onClickBooking} />
			) : (
				<ColumnView />
			)}

			<Modal
				opened={opened}
				onClose={onModalCloseBooking}
				centered
				size="auto"
				transitionProps={{
					transition: "slide-up",
					duration: 200,
					timingFunction: "ease-in-out",
				}}
			>
				<BookingFormComponent
					currentBooking={clickedBooking}
					availableAssets={null} //TODO: Fill this in
					onSubmit={onModalSubmitBooking}
					onClose={onModalCloseBooking}
				/>
			</Modal>
		</div>
	);
}

export default Bookings;
