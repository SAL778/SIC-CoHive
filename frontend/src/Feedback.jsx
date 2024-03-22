import React, { useState, useEffect, useContext } from "react";
import { httpRequest } from "./utils.js";
import { HostContext } from "./App.jsx";

function Feedback() {
	const { host } = useContext(HostContext);
	const [feedbackLink, setFeedbackLink] = useState("");

	useEffect(() => {
		httpRequest({
			endpoint: `${host}/applinks/`,
			onSuccess: (data) => {
				const feedbackLink = data[0]?.feedback_form_link || "";
				setFeedbackLink(feedbackLink);
			},
		});
	}, []);

	return (
		<div className="flex justify-center my-[30px] mx-auto">
			{feedbackLink && (
				<iframe src={feedbackLink} width="1000" height="1000">
					Loading...
				</iframe>
			)}
		</div>
	);
}

export default Feedback;
