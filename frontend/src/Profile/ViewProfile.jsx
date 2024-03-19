import React, { useState, useEffect, useContext } from "react";
import { HostContext, UserContext } from "../App.jsx";
import { httpRequest } from "../utils.js";
import { Routes, Route, useParams } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { TextEditor } from './TextEditor.jsx';
import Portfolio from './PortfolioCarousel.jsx'
import {ErrorNotification, SuccessNotification} from "../components/notificationFunctions.js";
import ProfileHeader from "./ProfileHeader.jsx";

export default function ViewProfile() {

	const { profileUserId } = useParams();										    //Used to GET the profile
	const [profileUser, setProfileUser] = useState({})								//Current user's profile
    const [isLoading, setLoading] = useState(true)		
	const { host } = useContext(HostContext);
    const [portfolio, setPortfolio] = useState([])

    //Get the user data 
	useEffect(() => {
        httpRequest({
            endpoint: `${host}/users/${profileUserId}/`,
            onSuccess: (userData) => {
                setProfileUser(userData);
                if (userData.portfolioVisibility) {                          //Another request is portfolio is set to visible
                    httpRequest({
                        endpoint: `${host}/users/${userData.id}/portfolio/`,
                        onSuccess: (portfolioData) => {
                            setPortfolio(portfolioData); // Expected: List
                            setLoading(false);
                        }
                    });
                }
                else {
                    setLoading(false);
                }
            }
        });
    }, []);

    return (
        isLoading ? (
            <Loader />
        ) : (
            <div>
                <ProfileHeader profileUser={profileUser} />
                <Portfolio portfolioItems={portfolio.items} isEditable={false} />
                <TextEditor initialValue={portfolio.description} readOnly={true}/>
            </div>
        )
    );
}