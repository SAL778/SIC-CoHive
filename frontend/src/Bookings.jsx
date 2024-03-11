import React, { useState, useRef, useContext, useEffect } from "react";
import { HostContext, UserContext } from "./App.jsx";
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
import { getCookieValue } from "./utils.js";

// import { checkUserLoggedIn } from "./utils.js";

function Bookings() {
	// checkUserLoggedIn();
	const [availableRooms, setAvailableRooms] = useState([]);
	const [availableEquipment, setAvailableEquipment] = useState([]);
	const [currentAssetViewIsRoom, setCurrentAssetViewIsRoom] = useState(true);
	const [currentDay, setCurrentDay] = useState(new Date());

	const { host } = useContext(HostContext);
	const { currentUser, setCurrentUser } = useContext(UserContext);

	const [opened, { open, close }] = useDisclosure(false);

	const [clickedBooking, setClickedBooking] = useState(null);
	const [isColumnView, setIsColumnView] = useState(true);

	const [filters, setFilters] = useState([]); // state to hold filters; List View.
	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	// Fetch user data to set the current user context to fill user's data on the bookings page
	// Need to fetch user data to get the user's ID, image, and other details to display on the page
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const accessToken = getCookieValue("access_token");
				const response = await fetch("http://localhost:8000/users/profile/", {
					method: "GET",
					credentials: "include",
					headers: {
						Authorization: `Token ${accessToken}`,
					},
				});

				if (response.ok) {
					const user = await response.json();
					setCurrentUser(user);
				} else {
					console.error("Failed to fetch user data:", response.statusText);
				}
			} catch (error) {
				console.error("Unexpected error:", error);
			}
		};

		fetchUserData();
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
		console.log("click");
		console.dir(bookingInfo);
		setClickedBooking(bookingInfo);
		open();
	};

	//Send the updated booking (not necessarily the one that was clicked)
	const onModalSubmitBooking = (bookingInfo) => {
		console.dir(bookingInfo);
		// If bookingInfo has an ID, it is a PATCH (frontend doesn't assign this)
		if (!!bookingInfo.id) {
			httpRequest({
				endpoint: `${host}/bookings/${bookingInfo.id}/`,
				method: "PATCH",
				body: JSON.stringify(bookingInfo),
				onSuccess: () => {
					console.log("Success");
					new SuccessNotification(
						"Booking modified",
						`${bookingInfo.resources_name} was succesfully edited!`
					).show();
				},
				onFailure: () => {
					console.log("Fail");
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
					console.log("Success");
					new SuccessNotification(
						"Booking added",
						`${bookingInfo.resources_name} was succesfully booked!`
					).show();
				},
				onFailure: () => {
					console.log("Fail");
					console.dir(bookingInfo);
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
				console.log("Success");
				new SuccessNotification(
					"Booking deleted",
					`${bookingInfo.resources_name} was succesfully deleted!`
				).show();
			},
			onFailure: () => {
				console.log("Fail");
				console.dir(bookingInfo);
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
				<div className="flex flex-row gap-10 justify-between align-top">
					<BookingListView
						onItemClick={onClickBooking}
						assetType={currentAssetViewIsRoom ? "room" : "equipment"}
						filters={filters} // check
					/>
					<BookingsListFilter
						// onSearch={handleSearch}
						onFilterChange={handleFilterChange}
						assetType={currentAssetViewIsRoom ? "room" : "equipment"}
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
				/>
			)}
			{/* {!isColumnView && (
				<div className="filter-wrapper">
					<BookingsListFilter
						// onSearch={handleSearch}
						onFilterChange={handleFilterChange}
						assetType={currentAssetViewIsRoom ? "room" : "equipment"}
					/>
				</div>
			)} */}

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
					availableAssets={
						currentAssetViewIsRoom ? availableRooms : availableEquipment
					} //TODO: Fill this in
					onSubmit={onModalSubmitBooking}
					onClose={onModalCloseBooking}
					onDelete={onModalDeleteBooking}
				/>
			</Modal>
		</div>
	);
}

export default Bookings;
