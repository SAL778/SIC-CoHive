import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationContext } from "./App.jsx";
import { getCookieValue } from "./utils.js";
import { Modal } from "@mantine/core";

const Signout = ({opened, onClose}) => {
	// checkUserLoggedIn();

	const navigate = useNavigate();
	const { setShowNavigation } = useContext(NavigationContext); // Access the context

	const handleSignout = async () => {
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
				onClose();
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
			opened={opened}
			onClose={onClose}
			centered
			withCloseButton={false}
			size="auto"
			transitionProps={{
				transition: "fade",
				duration: 300,
				timingFunction: "ease",
			}}
		>
			<div className="modalContent p-4 text-center">
				<p className="font-sans text-lg mb-4">
					Are you sure you want to sign out?
				</p>
				<div className="flex justify-end gap-4">
					<button
						onClick={onClose}
						className="button-grey-hover"
					>
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
