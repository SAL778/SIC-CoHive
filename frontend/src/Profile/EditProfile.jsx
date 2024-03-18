import React, { useState, useEffect, useContext } from "react";
import { HostContext, UserContext } from "../App.jsx";
import { httpRequest } from "../utils.js";
import { Routes, Route, useParams } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { TextEditor } from './TextEditor.jsx';
import Portfolio from './PortfolioCarousel.jsx'

export default function Profile() {

	const { profileUserId } = useParams();									//Used to GET the profile
	const { currentUser } = useContext(UserContext);						//Who's accessing the profile
	const [profileUser, setProfileUser] = useState(currentUser)				//Whose profile it is		
	const { host } = useContext(HostContext);

	const [portfolio, setPortfolio] = useState([])
	const [isLoading, setLoading] = useState(true)

	const matchesCurrentUser = () => {
		currentUser?.id == profileUser?.id
	}

	const onTextSubmit = (value) => {
		console.log(value)
	}

	//Get the user data 
	useEffect(() => {
		httpRequest({
			endpoint: `${host}/users/profile/`, // Get the profile
			onSuccess: (userData) => {
				setProfileUser(userData);
				httpRequest({
					endpoint: `${host}/users/${userData.id}/portfolio/`, // Get the portfolio if visible
					onSuccess: (portfolioData) => {
						setPortfolio(portfolioData); // Expected: List
						setLoading(false);
					}
				});
			},
		});
	}, []);

	return (
		<>
		  {isLoading ? (
			<Loader />
		  ) : (
			<>
			  {/* {matchesCurrentUser() && (
				<div>
				  <button>Private</button>
				  <button>Public</button>
				</div>
			  )}
	  
			  <div className="profileHeader">
				<img
				  src={profileUser.profileImage}
				  alt={`Image of ${profileUser.first_name}`}
				/>
				<h2>{profileUser.first_name + ' ' + profileUser.last_name}</h2>
				<h3>{profileUser.email}</h3>
			  </div> */}
	  
			  {/* Sidebar carousel */}
			  	<Portfolio portfolioItems= {portfolio.items} isEditable={true} />
	
				<TextEditor initialValue = {portfolio.description} onValueSubmit = {onTextSubmit}/>
			</>
		  )}
		</>
	  );
}
