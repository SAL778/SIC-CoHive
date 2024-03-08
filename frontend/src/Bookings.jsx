import React, { useState, useRef } from "react";
import ModalComponent from "./components/CustomModal";
import BookingListView from "./Bookings/BookingList.jsx";
import BookingFormComponent from "./components/Forms/BookingForm";

import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import ColumnView from "./Bookings/BookingColumnView.jsx";
import BookingHeader from "./Bookings/BookingHeader.jsx";
// import { checkUserLoggedIn } from "./utils.js";

function Bookings() {
	// checkUserLoggedIn();

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
		//TODO: Send to backend
		console.log("Submitted");
		console.dir(bookingInfo);
		notifications.show({
			autoClose: 3000,
			color: "orange",
			title: "Submitted Booking",
			message: "Booking was submitted",
		});
		setClickedBooking(null);
		close();
	};

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
