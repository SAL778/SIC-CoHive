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
				<div className="flex flex-row gap-4 overflow-x-hidden overflow-y-scroll px-[10px] py-[30px] max-w-[1520px] mx-auto h-full">
					<EmblaCarousel slides={columnView.map((item, index) => (
						<Column key={index} column={item} />
					))} options={{ align: "start" }} />
				</div>
			)}
		</>
	);
}