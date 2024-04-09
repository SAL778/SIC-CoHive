import React, { useState, useRef, useContext, useEffect } from "react";
import { NavigationContext, HostContext, UserContext } from "./App.jsx";
import BookingListView from "./Bookings/BookingList.jsx";
import BookingFormComponent from "./components/Forms/BookingForm";
import {
	ErrorNotification,
	SuccessNotification,
} from "./components/notificationFunctions.js";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import ColumnView from "./Bookings/BookingColumnView.jsx";
import BookingHeader from "./Bookings/BookingHeader.jsx";
import BookingsListFilter from "./Bookings/BookingsListFilter.jsx";
import { httpRequest } from "./utils.js";

function Bookings() {
	// checkUserLoggedIn();
	const [isUpdated, setIsUpdated] = useState(0);
	const [availableRooms, setAvailableRooms] = useState([]);
	const [availableEquipment, setAvailableEquipment] = useState([]);
	const [currentAssetViewIsRoom, setCurrentAssetViewIsRoom] = useState(true);
	const [currentDay, setCurrentDay] = useState(new Date());

	const [selectedDates, setSelectedDates] = useState([null, null]);
	const [selectedAssets, setselectedAssets] = useState([]);
	const [bookingFilter, setBookingFilter] = useState("All Bookings");

	const { host } = useContext(HostContext);
	const { currentUser, setCurrentUser } = useContext(UserContext);

	const [opened, { open, close }] = useDisclosure(false);

	const [clickedBooking, setClickedBooking] = useState(null);
	const [isColumnView, setIsColumnView] = useState(true);

	const [filters, setFilters] = useState([]); // state to hold filters; List View.
	const handleFilterChange = ({
		selectedFilters,
		fromDate,
		toDate,
		selectedAssets,
		bookingFilter: updatedBookingFilter,
	}) => {
		setFilters(selectedFilters);
		setSelectedDates([fromDate, toDate]);
		setselectedAssets(selectedAssets);
		setBookingFilter(updatedBookingFilter);
	};

	const { setShowNavigation } = useContext(NavigationContext);
	useEffect(() => {
        setShowNavigation(true);
    }, []);
	
	// Fetch user data to set the current user context to fill user's data on the bookings page
	// Need to fetch user data to get the user's ID, image, and other details to display on the page
	useEffect(() => {
		httpRequest({
			endpoint: `${host}/users/profile/`,
			onSuccess: (data) => {
				setCurrentUser(data);
			},
		});
	}, []);

	useEffect(() => {
		httpRequest({
			endpoint: `${host}/bookings/resources/filter?type=room`,
			onSuccess: (data) => {
				setAvailableRooms(data);
			},
		});
		httpRequest({
			endpoint: `${host}/bookings/resources/filter?type=equipment`,
			onSuccess: (data) => {
				setAvailableEquipment(data);
			},
		});
	}, []); // The empty array specifies run only once (during render phase)

	const onClickBooking = (bookingInfo) => {
		console.dir(bookingInfo);
		setClickedBooking(bookingInfo);
		open();
	};

	//Send the updated booking (not necessarily the one that was clicked)
	const onModalSubmitBooking = (bookingInfo) => {

		// If bookingInfo has an ID, it is a PATCH (frontend doesn't assign this)
		if (!!bookingInfo.id) {
			httpRequest({
				endpoint: `${host}/bookings/${bookingInfo.id}/`,
				method: "PATCH",
				body: JSON.stringify(bookingInfo),
				onSuccess: () => {
					// console.log("Success");
					setIsUpdated(isUpdated + 1); //Trigger the re-render
					new SuccessNotification(
						"Booking modified",
						`${bookingInfo.resources_name} was succesfully edited!`
					).show();
				},
				onFailure: () => {
					// console.log("Fail");
					console.dir(bookingInfo);
					new ErrorNotification(
						"Booking couldn't be modified",
						`${bookingInfo.resources_name} couldn't be booked`
					).show();
				},
			});
		}
		// If bookingInfo has no ID, it is a POST for a new booking
		else {
			httpRequest({
				endpoint: `${host}/bookings/user/${currentUser?.id}/`,
				method: "POST",
				body: JSON.stringify(bookingInfo),
				onSuccess: () => {
					// console.log("Success");
					setIsUpdated(isUpdated + 1); //Trigger the re-render
					new SuccessNotification(
						"Booking added",
						`${bookingInfo.resources_name} was succesfully booked!`
					).show();
				},
				onFailure: () => {
					// console.log("Fail");
					new ErrorNotification(
						"Booking couldn't be added",
						`${bookingInfo.resources_name} couldn't be booked`
					).show();
				},
			});
		}
		//Wait until the modal transition has occurred before removing data
		setTimeout(() => {
			setClickedBooking(null);
		}, 300);
		close();
	};

	const onModalDeleteBooking = (bookingInfo) => {
		httpRequest({
			endpoint: `${host}/bookings/${bookingInfo.id}/`,
			method: "DELETE",
			onSuccess: () => {
				// console.log("Success");
				setIsUpdated(isUpdated + 1);
				new SuccessNotification(
					"Booking deleted",
					`${bookingInfo.resources_name} was succesfully deleted!`
				).show();
			},
			onFailure: () => {
				// console.log("Fail");
				new ErrorNotification(
					"Booking couldn't be deleted",
					`${bookingInfo.resources_name} couldn't be deleted`
				).show();
			},
		});
		setClickedBooking(null);
		close();
	};

	const onModalCloseBooking = () => {
		//Wait until the modal transition has occurred before removing data
		setTimeout(() => {
			setClickedBooking(null);
		}, 300);
		close();
	};

	return (
		<div className="h-full overflow-clip flex-grow">
			<BookingHeader
				setColumnView={setIsColumnView}
				onBookClick={onClickBooking}
				onToggleRooms={setCurrentAssetViewIsRoom}
				onSetDate={setCurrentDay}
				currentDate={currentDay}
			/>
			{!isColumnView ? (
				<div className="parent-container-booking-row flex gap-4 justify-between align-top">
					<BookingsListFilter
						onFilterChange={handleFilterChange}
						assetType={currentAssetViewIsRoom ? "room" : "equipment"}
						selectedDates={selectedDates}
						selectedAssets={selectedAssets}
					/>

					<BookingListView
						onItemClick={onClickBooking}
						assetType={currentAssetViewIsRoom ? "room" : "equipment"}
						filters={filters}
						selectedDates={selectedDates}
						selectedAssets={selectedAssets}
						bookingFilter={bookingFilter}
						isUpdated={isUpdated} //Triggers re-render
					/>
				</div>
			) : (
				<ColumnView
					onBookingEdit={onClickBooking}
					assetType={currentAssetViewIsRoom ? "room" : "equipment"}
					currentDate={
						currentDay
							?.toLocaleString("en-CA", { timeZone: "America/Edmonton" })
							.split(",")[0]
					}
					isUpdated={isUpdated}
				/>
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
					currentDate={currentDay}
					availableAssets={
						currentAssetViewIsRoom ? availableRooms : availableEquipment
					}
					onSubmit={onModalSubmitBooking}
					onClose={onModalCloseBooking}
					onDelete={onModalDeleteBooking}
				/>
			</Modal>
		</div>
	);
}

export default Bookings;
