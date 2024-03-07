import React from "react";
import ColumnView from "./Bookings/ColumnView.jsx";
import BookingHeader from "./Bookings/BookingHeader.jsx";

function Bookings() {
	return (
		<div className="h-full overflow-clip flex-grow">
			<BookingHeader />
			<ColumnView />
		</div>
	);
}

export default Bookings;
