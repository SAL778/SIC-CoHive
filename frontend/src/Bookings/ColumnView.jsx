import React, { useState, useContext, useEffect } from "react";
import { HostContext } from "../App.jsx";
import { getCookieValue } from "../utils.js";
import Column from "./Column.jsx";
import EmblaCarousel from "../components/Carousel/Carousel.jsx";

export default function ColumnView() {
	//const [userData, setUserData] = useState(null);
	const { host } = useContext(HostContext);

	const [columnView, setColumnView] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const accessToken = getCookieValue("access_token");
				const response = await fetch("http://localhost:8000/booking/resources/", {
					method: "GET",
					credentials: "include",
					headers: {
						Authorization: `Token ${accessToken}`,
					},
				});

				if (response.ok) {
					response.json().then(columnView => {
						setColumnView(columnView)
						setLoading(false);
					});
				}
				else {
					console.log("Error fetching all bookings", response.statusText);
				}
			} catch (error) {
				console.log("Error", error);
			}
		};

		fetchUserData();
	}, []);

	return (
		<>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div className="flex flex-row flex-grow overflow-clip px-[10px] my-8 h-full">
					<div className="flex flex-col mt-[100px] h-full mr-8">
						{Array.from({ length: 52 }, (_, index) => {
							const hour = Math.floor(index / 4) + 7;
							const minute = (index % 4) * 15;
							let time = "";
							if (hour < 12) {
								time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} AM`;
							} else if (hour === 12) {
								time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} PM`;
							} else {
								time = `${(hour - 12).toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} PM`;
							}
							return (
								<div key={index} className="flex items-start justify-center min-h-[36px] w-[80px] rounded-lg overflow-hidden text-sm font-bold">
									{minute === 0 || minute === 30 ? time : null}
								</div>
							);
						})}
					</div>
					<div className="booking-column-container overflow-x-hidden h-full p-[10px] m-[-10px]">
						<EmblaCarousel slides={columnView.map((item, index) => (	
							<Column key={index} column={item}/>
						))} options={{ align: "start", watchDrag: false }} />
					</div>
				</div>
			)}
		</>
	);
}