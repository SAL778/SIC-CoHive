import React, { useEffect, useContext } from "react";
import placeholder from './assets/placeholder-logo.png';
import "./Login.css";
import { NavigationContext } from "./App.jsx";
import axiousInstance from "./axios.js";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

import { UserContext } from "./App.jsx";

export default function Login({}){

    const { setShowNavigation } = useContext(NavigationContext); // Access the context

    const { user, setUser } = useContext(UserContext);

    const decodeJWT = (credentialJWT) => {
        try {
            // Decode the JWT using jwt-decode
            const decodedToken = jwtDecode(credentialJWT);
    
            console.log('Decoded JWT:', decodedToken);
        } catch (error) {
            console.error('Error decoding JWT:', error);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const jwt_token = credentialResponse.credential;

            // Make an HTTP request to the Django view
            const response = await axios.post(
                'http://localhost:8000/api/verify_google_jwt/',
                { jwt_token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Include credentials (cookies) in the request
                }
            );

            console.log(response.data); // Log the response data
            // Redirect to /bookings if the request is successful
            if (response.status === 302 || response.status === 200) {
                setUser(user);
                window.location.href = '/bookings';
            }
            // Continue with other actions or state updates as needed
        } catch (error) {
            console.error('Error making Django request:', error);
        }
    };

    useEffect(() => {
        setShowNavigation(location.pathname !== "/");
    }, [location.pathname, setShowNavigation]);

    return(
        <> 
            <div className="background-container"></div> 
            <img src={placeholder} className="logo object-none" alt="Logo" />
            <div className="signInButtons flex flex-col gap-4">
                {/* <button onClick={googleSignInClick}  type="button" className="button-orange rounded-md p-3 shadow-custom text-2xl">
                    <i className="fa-brands fa-google mr-4"/>
                    Continue with Google
                </button> */}
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
                {/* <button onClick={guestSignInClick} type="button" className="button-orange p-3 rounded-md shadow-custom text-2xl">
                    <i className="fa fa-user mr-4"/>
                    Continue as Guest
                </button> */}
            </div>
            <div className="access-info">
                <p className="access-info text-neutral-400 justify-self-end">
                    All registering users must first be approved by the Student Innovation Center
                    prior to accessing any amenities. The Student Innovation Center is for University
                    students, or University adjacent organizations only.
                </p>
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
            client_secret: "1kqWXBrFkxTHpECThcZkC3PcaxZmfibrQ4QzSSAynXXGChVQqMb0QLPg58TkZaUKTMuiU9zzihG9qSThHFz7IXYSBu5YoM2p2QhydT0uQak9IA2V2gQFrT4dmlaX094y",
        })
        .then((res) => {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
        });
};