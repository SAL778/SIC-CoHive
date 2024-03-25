import React from "react";

export default function EventList({ event }) {
	return (
		<div className="list-booking-item flex items-center py-4 px-6 rounded-md cursor-pointer gap-10 shadow-custom">
			
			<div className="colB basis-1 flex flex-grow text-2xl gap-4 mr-24">
				<i className="fa fa-location-dot" aria-hidden="true" />
				<p className="font-light" style={{ color: "inherit" }}>
					{event.location || "No location"}
				</p>
			</div>

			<div className="colA basis-2 flex-col flex-grow text-neutral-800">
				<h3
					className="text-2xl font-semibold capitalize leading-[1]"
					style={{ color: "inherit" }}
				>
					{event.title}
				</h3>
			</div>

			<div className="colC basis-1 flex flex-row flex-grow items-center ml-16">
				<i
					className="fa fa-calendar mr-3 text-2xl text-neutral-800"
					style={{ color: "inherit" }}
				/>
				<div className="timeSlot">
					<p
						className="text-base font-medium text-orange-600"
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
						className="text-base font-medium flex gap-1"
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
		</div>
	);
}
