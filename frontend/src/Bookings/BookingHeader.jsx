import React, { useState } from "react";
import DateSelector from "../components/DateSelector";

/**Component function that renders a booking header
 *
 * @param {function} setColumnView - Callback that toggles the booking view
 * @param {function} onToggleRooms - Callback that toggles the viewed resource
 * @returns
 */

const BookingHeader = ({
	setColumnView,
	onBookClick,
	onToggleRooms,
	onSetDate,
	currentDate,
}) => {
	const [selectedTab, setSelectedTab] = useState("Rooms");
	const [selectedIcon, setSelectedIcon] = useState("columns");

	const isBeforeToday = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); //Rewind to beginning of day
		return currentDate < today;
	};

	return (
		<div className="flex flex-col z-10 mt-[30px] px-[10px] w-full gap-8">
			<div className="w-fit min-w-[250px]">
				<DateSelector onSetDate={onSetDate} currentDate={currentDate}/>
			</div>

			<div className="flex flex-row justify-between items-end">
				<div>
					<button
						type="button"
						disabled={isBeforeToday()}
						onClick={() => onBookClick(null)}
						className={`${
							isBeforeToday()
								? "cursor-not-allowed button-disabled"
								: ""
						} button-orange button-wide h-[64px]`}
					>
						New Booking
					</button>
				</div>
				<div className="flex flex-row justify-between items-center gap-6">
					<div className="flex flex-row justify-between gap-3 items-center bg-white py-0 px-5 shadow-custom rounded-[5px] h-[64px]">
						<button
							className={`${
								selectedTab === "Rooms" ? "button-orange" : "button-clear"
							} flex items-center gap-3 p-3 button-thin`}
							onClick={() => {
								onToggleRooms(true);
								setSelectedTab("Rooms");
							}}
						>
							Rooms
						</button>
						<button
							className={`${
								selectedTab === "Equipment" ? "button-orange" : "button-clear"
							} flex items-center gap-3 p-3 button-thin`}
							onClick={() => {
								onToggleRooms(false);
								setSelectedTab("Equipment");
							}}
						>
							Equipment
						</button>
					</div>
					<div className="flex flex-row justify-between gap-3 items-center bg-white py-0 px-5 shadow-custom rounded-[5px] h-[64px]">
						<button
							className={`${
								selectedIcon === "columns" ? "button-orange" : "button-clear"
							} flex items-center gap-3 p-3 button-thin`}
							onClick={() => {
								setColumnView(true);
								setSelectedIcon("columns");
							}}
						>
							<i className="fa fa-columns"></i>
						</button>
						<button
							className={`${
								selectedIcon === "rows" ? "button-orange" : "button-clear"
							} flex items-center gap-3 p-3 button-thin`}
							onClick={() => {
								setColumnView(false);
								setSelectedIcon("rows");
							}}
						>
							<i className="fa fa-th-list"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingHeader;
