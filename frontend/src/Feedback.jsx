import React, { useState, useEffect, useContext } from "react";

function Feedback() {
	const [iframeWidth, setIframeWidth] = useState(1000);
	const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 60);

	const feedbackLink = JSON.parse(localStorage.getItem("appLinks"))[0].feedback_form_link;

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
