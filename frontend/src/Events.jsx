import React from "react";

function Events() {
	return (
		<div className="parentContainer">
			<div className="calendarContainer">
				<iframe
					src="https://embed.styledcalendar.com/#QsoYY1jHXbqoa6iOHxZi"
					title="Styled Calendar"
					className="calendarFrame styled-calendar-container"
					style={{ width: "100%", height: "1800px", border: "none" }}
					data-cy="calendar-embed-iframe"
				></iframe>
				{/* <script
				async
				type="module"
				src="https://embed.styledcalendar.com/assets/parent-window.js"
			></script> */}
			</div>
		</div>
	);
}

export default Events;
