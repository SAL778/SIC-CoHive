import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationContext } from "./App.jsx";
import { getCookieValue } from "./utils.js";
import { Modal } from "@mantine/core";

const Signout = () => {
	// checkUserLoggedIn();

	const navigate = useNavigate();
	const { setShowNavigation } = useContext(NavigationContext); // Access the context
	const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility

	const handleSignout = async () => {
		setIsModalOpen(false);
		try {
			const accessToken = getCookieValue("access_token");

			console.log(accessToken);
			const response = await fetch("http://localhost:8000/users/signout/", {
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Token ${accessToken}`,
				},
			});
			if (response.ok) {
				setShowNavigation(false);
				navigate("/");
			} else {
				console.error("Failed to sign out");
			}
		} catch (error) {
			console.error("Error during sign out:", error);
		}
	};

	return (
		<Modal
			opened={isModalOpen}
			centered
			withCloseButton={false}
			size="auto"
			overlayOpacity={0.55}
			overlayBlur={3}
			transitionProps={{
				transition: "fade",
				duration: 300,
				timingFunction: "ease",
			}}
		>
			<div className="modalContent p-6 text-center">
				<p className="font-sans text-lg mb-5">
					Are you sure you want to sign out?
				</p>
				<div className="flex justify-center gap-4">
					<button onClick={() => setIsModalOpen(false)} className="button-red">
						Cancel
					</button>
					<button onClick={handleSignout} className="button-orange">
						Confirm
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default Signout;
