import React from "react";
import { checkUserLoggedIn } from "./utils.js"

function Statistics() {

	checkUserLoggedIn();

	return (
		<div>
			<h1 style={{ color: "black", fontFamily: "Arial, sans-serif" }}>
				Statistics page
			</h1>
		</div>
	);
}

export default Statistics;
