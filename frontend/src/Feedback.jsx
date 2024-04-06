import React, { useState, useEffect, useContext } from "react";
import { httpRequest } from "./utils.js";
import { NavigationContext, HostContext } from "./App.jsx";

function Feedback() {
	const { host } = useContext(HostContext);
	const [feedbackLink, setFeedbackLink] = useState("");
	const [iframeWidth, setIframeWidth] = useState(1000);
	const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 60);

	const { setShowNavigation } = useContext(NavigationContext);

    useEffect(() => {
        setShowNavigation(true);
    }, []);

	useEffect(() => {
		httpRequest({
			endpoint: `${host}/applinks/`,
			onSuccess: (data) => {
				const feedbackLink = data[0]?.feedback_form_link || "";
				setFeedbackLink(feedbackLink);
			},
		});
	}, []);

	useEffect(() => {
		const handleResize = () => {
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;
			if (screenWidth > 1400) {
				setIframeWidth(1000);
			} else if (screenWidth > 1120) {
				setIframeWidth(700);
			} else {
				setIframeWidth(screenWidth - 60);
			}

			if (screenWidth > 1120) {
				setIframeHeight(screenHeight - 60);
			} else {
				setIframeHeight(screenHeight - 130);
			}
			
		};

		window.addEventListener("resize", handleResize);
		handleResize();
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div id="feedback-form" className="content-container flex justify-center my-[30px] mx-auto rounded-[12px] overflow-auto">
			{feedbackLink && (
				<iframe src={feedbackLink} width={iframeWidth} height={iframeHeight}>
					Loading...
				</iframe>
			)}
		</div>
	);
}

export default Feedback;
