import React, { useState, useRef, useContext, useEffect } from "react";
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
	const [availableRooms, setAvailableRooms] = useState([])
	const [availableEquipment, setAvailableEquipment] = useState([])
	const [currentAssetViewIsRoom, setCurrentAssetViewIsRoom] = useState(true)

	const { host } = useContext(HostContext)
	const { currentUser } =  useContext(UserContext); //alias user as currentUser

	const [opened, { open, close }] = useDisclosure(false);

	const [clickedBooking, setClickedBooking] = useState(null);
	const [isColumnView, setIsColumnView] = useState(true);

	useEffect(() => {
			httpRequest({
					endpoint: `${host}/bookings/resources/filter?type=room`,
					onSuccess: (data) => {
						setAvailableRooms(data);
					}
				}
			);
			httpRequest({
					endpoint: `${host}/bookings/resources/filter?type=equipment`,
					onSuccess: (data) => {
						setAvailableEquipment(data);
					}
				}
			);
		}, []); // The empty array specifies run only once (during render phase)

	const onClickBooking = (bookingInfo) => {
		console.log("click");
		setClickedBooking(bookingInfo);
		open();
	};

	//Send the updated booking (not necessarily the one that was clicked)
	const onModalSubmitBooking = (bookingInfo) => {
		console.dir(bookingInfo)
		//If bookingInfo has an ID, it is a PATCH (frontend doesn't assign this)
		if (!!bookingInfo.id) {
			httpRequest({
				endpoint: `${host}/bookings/${bookingInfo.id}/`,
				method: "PATCH",
				body: JSON.stringify(bookingInfo),
				onSuccess: () => {
					console.log("Success")
					new SuccessNotification("Booking modified", `${bookingInfo.resources_name} was succesfully edited!`).show()
				},
				onFailure: () => {
					console.log("Fail")
					console.dir(bookingInfo)
					new ErrorNotification("Booking couldn't be modified", `${bookingInfo.resources_name} couldn't be booked`).show()
				}
			})
		}
		//New booking posted
		else {
			httpRequest({
				endpoint: `${host}/bookings/user/${currentUser?.id}/`,
				method: "POST",
				body: JSON.stringify(bookingInfo),
				onSuccess: () => {
					console.log("Success")
					new SuccessNotification("Booking added", `${bookingInfo.resources_name} was succesfully booked!`).show()
				},
				onFailure: () => {
					console.log("Fail")
					console.dir(bookingInfo)
					new ErrorNotification("Booking couldn't be added", `${bookingInfo.resources_name} couldn't be booked`).show()
				}
			})
		}
		setClickedBooking(null)
		close()
	}

	const onModalDeleteBooking = (bookingInfo) => {
		httpRequest({
			endpoint: `${host}/bookings/${bookingInfo.id}/`,
			method: "DELETE",
			onSuccess: () => {
				console.log("Success")
				new SuccessNotification("Booking deleted", `${bookingInfo.resources_name} was succesfully deleted!`).show()
			},
			onFailure: () => {
				console.log("Fail")
				console.dir(bookingInfo)
				new ErrorNotification("Booking couldn't be deleted", `${bookingInfo.resources_name} couldn't be deleted`).show()
			}
		});
		setClickedBooking(null);
		close();
	}

	const onModalCloseBooking = () => {
		setClickedBooking(null);
		close();
	};

	return (
		<div className="h-full overflow-clip flex-grow">
			<BookingHeader setColumnView={setIsColumnView} onBookClick={onClickBooking} onAssetToggle={setCurrentAssetViewIsRoom}/>

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
				availableAssets={currentAssetViewIsRoom ? availableRooms : availableEquipment} //TODO: Fill this in
				onSubmit={onModalSubmitBooking}
				onClose={onModalCloseBooking}
				onDelete={onModalDeleteBooking}
			/>
			</Modal>
		</div>
	);
}

export default Bookings;
