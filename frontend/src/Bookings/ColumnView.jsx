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
						console.log(columnView);
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
				<div className="flex flex-row flex-grow gap-4 overflow-clip px-[10px] my-[30px] h-full">
					<div className="flex flex-col mt-[100px] h-full">
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
								<div key={index} className="flex items-center justify-center min-h-[56px] w-[80px] rounded-lg overflow-hidden shadow-custom text-sm">
									{time}
								</div>
							);
						})}
					</div>
					<div className="overflow-x-hidden h-full pl-[10px] pr-[30px]">
						<EmblaCarousel slides={columnView.map((item, index) => (	
							<Column key={index} column={item} />
						))} options={{ align: "start" }} />
					</div>
				</div>
			)}
		</>
	);
}