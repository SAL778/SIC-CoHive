import React from "react";

export default function EventList({ event }) {
	return (
		<div className="list-booking-item flex items-center py-4 px-[30px] rounded-md cursor-pointer gap-4 shadow-custom">
			
			<div className="colA basis-2 flex-col flex-grow text-neutral-800">
				<h3
					className="large-text-mobile font-semibold capitalize leading-[1]"
					style={{ color: "inherit" }}
				>
					{event.title}
				</h3>
			</div>

			<div className="colC basis-1 flex flex-row flex-grow items-center">
				<i
					className="fa fa-calendar mr-3 large-text-mobile text-neutral-800"
					style={{ color: "inherit" }}
				/>
				<div className="timeSlot">
					<p
						className="text-for-mobile font-medium text-orange-600"
						style={{ color: "inherit" }}
					>
						{/* {event.start} - {event.end} */}
						{new Date(event.start).toLocaleTimeString("en-US", {
							hour: "numeric",
							minute: "numeric",
							hour12: true,
						})}{" "}
						-{" "}
						{new Date(event.end).toLocaleTimeString("en-US", {
							hour: "numeric",
							minute: "numeric",
							hour12: true,
						})}
					</p>
					<p
						className="text-for-mobile font-medium flex gap-1"
						style={{ color: "inherit" }}
					>
						<span>
							{new Date(event.start).toLocaleDateString("en-us", {
								weekday: "long",
								month: "short",
								day: "numeric",
							})}
						</span>
					</p>
				</div>
			</div>

			<div className="colB basis-1 flex flex-grow large-text-mobile items-center">
				<i className="fa fa-location-dot mr-3" aria-hidden="true" />
				<p className="font-light" style={{ color: "inherit" }}>
					{event.location || "No location"}
				</p>
			</div>
		</div>
	);
}
