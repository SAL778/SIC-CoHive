import React, { useEffect, useContext } from "react";
import placeholder from "./assets/placeholder-logo.png";
import "./Login.css";
import { NavigationContext } from "./App.jsx";
import axiousInstance from "./axios.js";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { HostContext, UserContext } from "./App.jsx";
import { httpRequest } from "./utils.js";

export default function Login({}) {
	const { setShowNavigation } = useContext(NavigationContext); // Access the context

    // const { user, setUser } = useContext(UserContext);
    const { host } = useContext(HostContext)

	const handleGoogleLogin = async (credentialResponse) => {
		try {
			const jwt_token = credentialResponse.credential;

			// Make an HTTP request to the Django view
			const response = await axios.post(
				"http://localhost:8000/api/verify_google_jwt/",
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
                        window.location.href = '/bookings';
                    }
                })
            }
            // Continue with other actions or state updates as needed
        } catch (error) {
            console.error('Error making Django request:', error);
        }
    };

	useEffect(() => {
		setShowNavigation(location.pathname !== "/");
	}, [location.pathname, setShowNavigation]);

	return (
		<>
			<div className="background-container flex justify-end px-[100px]">
				<div className="flex flex-col justify-between items-center h-full pt-[94px] pb-[94px] w-[30%]">
					<img
						src={placeholder}
						className="logo object-contain max-w-[300px]"
						alt="Student Inovation Center"
					/>
					<div className="flex flex-col gap-40 items-center">
						<div className="flex flex-col gap-6 items-center">
							<h1 className="text-4xl font-bold text-center text-neutral-900">
								Sign In:
							</h1>
							<GoogleLogin
								onSuccess={handleGoogleLogin}
								onError={() => {
									console.log("Login Failed");
								}}
							/>
						</div>
						<p className="access-info text-neutral-400 text-center">
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

const googleSignInClick = () => {
	axiousInstance
		.post(`/auth/token`, {
			grant_type: "password",
			// username: formData.email,
			// password: formData.password,
			username: "admin@sic.ca",
			password: "123",
			client_id: "I3yNEPHBZQ2NgZbvHGglMvkpSTYHaaKau8GamJkm",
			client_secret:
				"1kqWXBrFkxTHpECThcZkC3PcaxZmfibrQ4QzSSAynXXGChVQqMb0QLPg58TkZaUKTMuiU9zzihG9qSThHFz7IXYSBu5YoM2p2QhydT0uQak9IA2V2gQFrT4dmlaX094y",
		})
		.then((res) => {
			localStorage.setItem("access_token", res.data.access_token);
			localStorage.setItem("refresh_token", res.data.refresh_token);
		});
};
