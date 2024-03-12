import React, { useState, useContext, useEffect } from "react";
import { HostContext } from "../App.jsx";
import { httpRequest } from "../utils.js";
import Column from "./Column.jsx";
import EmblaCarousel from "../components/Carousel/Carousel.jsx";
import { Loader } from "@mantine/core";


/** Function that returns a view of the ColumnView.
 * 
 * @param {function} onBookingEdit - A callable that triggers when a booking is edited
 * @param {string} assetType - A string of either "room" or "equipment" that specifies the asset requested
 * @param {date} currentDate - A string that specifies which day to get the bookings for
 * @returns 
 */
export default function ColumnView({onBookingEdit, assetType, currentDate}) {
	//const [userData, setUserData] = useState(null);
	const { host } = useContext(HostContext);

	const [columnView, setColumnView] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		httpRequest({
			endpoint: `${host}/bookings/columns/filter?type=${assetType}&date=${currentDate}`,
			onSuccess: (columnsData) => {
				setColumnView(columnsData);
				setTimeout(() => {
					setIsLoading(false); // Added this to mitigate "flashing" when toggling assetType.
				}, 150);
			}
		});
	}, [assetType, currentDate]);

	return (
		<>
			{isLoading ? (
				<Loader size={50} color="orange" />
			) : (
				<div className="flex flex-row flex-grow overflow-clip px-[10px] my-8 h-full">
					<div className="flex flex-col mt-[100px] h-full mr-8">
						{Array.from({ length: 52 }, (_, index) => {
							const hour = Math.floor(index / 4) + 7;
							const minute = (index % 4) * 15;
							let time = "";
							if (hour < 12) {
								time = `${hour.toString().padStart(2, "0")}:${minute
									.toString()
									.padStart(2, "0")} AM`;
							} else if (hour === 12) {
								time = `${hour.toString().padStart(2, "0")}:${minute
									.toString()
									.padStart(2, "0")} PM`;
							} else {
								time = `${(hour - 12).toString().padStart(2, "0")}:${minute
									.toString()
									.padStart(2, "0")} PM`;
							}
							return (
								<div
									key={index}
									className="flex items-start justify-center min-h-[24px] w-[80px] rounded-lg overflow-hidden text-sm font-bold leading-[1]"
								>
									{minute === 0 ? time : null}
								</div>
							);
						})}
					</div>
					<div className="booking-column-container overflow-x-hidden h-full p-[10px] m-[-10px]">
						<EmblaCarousel slides={columnView.map((item, index) => (	
							<Column key={index} column={item} onBookingEdit={onBookingEdit} />
						))} options={{ align: "start", watchDrag: false }} />
					</div>
				</div>
			)}
		</>
	);
}
