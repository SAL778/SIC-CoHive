import React, { useEffect, useContext } from "react";
import placeholder from "./assets/sic_logo.png";
import "./Login.css";
import { NavigationContext } from "./App.jsx";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { HostContext, UserContext } from "./App.jsx";
import { httpRequest } from "./utils.js";

export default function Login() {
	const { setShowNavigation } = useContext(NavigationContext); // Access the context

	// const { user, setUser } = useContext(UserContext);
	const { host } = useContext(HostContext);

	useEffect(() => {
		httpRequest({
			endpoint: `${host}/verify_token_expiry/`,
			onSuccess: (data) => {
				httpRequest({
					endpoint: `${host}/users/profile/`, //Add the current user to localStorage
					onSuccess: (userData) => {
						localStorage.setItem("currentUser", JSON.stringify(userData));

						// Get the app links and store them in localStorage for dynamic links to forms/calendar
						httpRequest({
							endpoint: `${host}/applinks/`,
							onSuccess: (linkData) => {
								localStorage.setItem("appLinks", JSON.stringify(linkData));
								window.location.href = "/bookings";
							},
						});
					},
				});
			},
		});
	}, []);

	const handleGoogleLogin = async (credentialResponse) => {
		try {
			const jwt_token = credentialResponse.credential;

			// Make an HTTP request to the Django view
			const response = await axios.post(
				`${host}/verify_google_jwt/`,
				{ jwt_token },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true, // Include credentials (cookies) in the request
				}
			);

			// Redirect to /bookings if the request is successful
			if (response.status === 302 || response.status === 200) {
				httpRequest({
					endpoint: `${host}/users/profile/`, //Add the current user to localStorage
					onSuccess: (userData) => {
						localStorage.setItem("currentUser", JSON.stringify(userData));

						// Get the app links and store them in localStorage for dynamic links to forms/calendar
						httpRequest({
							endpoint: `${host}/applinks/`,
							onSuccess: (linkData) => {
								localStorage.setItem("appLinks", JSON.stringify(linkData));
								window.location.href = "/bookings";
							},
						});
					},
				});
			}
			// Continue with other actions or state updates as needed
		} catch (error) {
			console.error("Error making Django request:", error);
		}
	};

	useEffect(() => {
		setShowNavigation(location.pathname !== "/");
	}, [location.pathname, setShowNavigation]);

	return (
		<>
			<div className="background-container flex justify-end">
				<div className="sign-in-column">
					<img
						src={placeholder}
						className="logo object-contain max-w-[300px]"
						alt="Student Inovation Center"
						referrerPolicy="no-referrer"
					/>
					<div className="flex flex-col gap-40 items-center">
						<div className="flex flex-col gap-6 items-center">
							<h1 className="text-large-desktop font-bold text-center text-neutral-900">
								Sign In:
							</h1>
							<GoogleLogin
								onSuccess={handleGoogleLogin}
								onError={() => {
									console.log("Login Failed");
								}}
							/>
						</div>
						<p className="access-info text-center">
							All registering users must first be approved by the Student
							Innovation Center prior to accessing any amenities. The Student
							Innovation Center is for University students, or University
							adjacent organizations only.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
