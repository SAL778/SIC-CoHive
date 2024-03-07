import React from "react";
import { checkUserLoggedIn } from "./utils.js";

function Events() {
	
	checkUserLoggedIn();

	return (
		<div>
			<h1 style={{ color: "black", fontFamily: "Arial, sans-serif" }}>
				Events page
			</h1>
		</div>
	);
}

export default Events;
