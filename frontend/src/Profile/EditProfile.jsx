import React, { useState, useEffect, useContext } from "react";
import { HostContext, UserContext } from "../App.jsx";
import { httpRequest } from "../utils.js";
import { Routes, Route, useParams } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { TextEditor } from './TextEditor.jsx';
import Portfolio from './PortfolioCarousel.jsx'
import {ErrorNotification, SuccessNotification} from "../components/notificationFunctions.js";


export default function Profile() {

	const { profileUserId } = useParams();									//Used to GET the profile
	const { currentUser } = useContext(UserContext);						//Who's accessing the profile
	const [profileUser, setProfileUser] = useState(currentUser)				//Whose profile it is		
	const { host } = useContext(HostContext);

	const [portfolio, setPortfolio] = useState([])
	const [portfolioVisibility, setPortfolioVisibility] = useState(profileUser.portfolioVisibility) 	//visibility toggle controls (only shows if current user is profile user)
	const [isLoading, setLoading] = useState(true)

	const matchesCurrentUser = () => (
		currentUser?.id == profileUser?.id
	)

	const onTextSubmit = (value) => {
		console.log(value)
		httpRequest({
			endpoint: `${host}/users/${currentUser.id}/portfolio/`,
			method: "PATCH",
			body: JSON.stringify({description: value}),
			onSuccess: () => {
				new SuccessNotification(
                    "Saved",
                    `New description was succesfully saved!`
                ).show();
			},
			onFailure: () => {
				new ErrorNotification(
                    "Failed",
                    `New description couldn't be saved`
                ).show();
			}
		})
	}

	const onUpdateVisibility = (visibility) => {
		if (visibility == !portfolioVisibility) {	//Conditional check to avoid spamming backend unnecessarily
			setPortfolioVisibility(visibility)
			httpRequest({
				endpoint: `${host}/users/${currentUser.id}/`,
				method: 'PATCH',
				body: JSON.stringify({portfolioVisibility: portfolioVisibility}),
				onSuccess: () => {
					new SuccessNotification(
						'Changed visibility', 
						`Portfolio set to ${portfolioVisibility ? "Public" : "Private"}`)
						.show()
				},
				onError: () => {
					new SuccessNotification(
						'Visibility unchanged', 
						"Portfolio visibility couldn't be changed")
						.show()
				}
			})
		}
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
			<div className="flex flex-col">
			  {matchesCurrentUser() && (
				<div className = "buttonToggleGroup w-16 flex gap-3 m-3 content-center">
					<button 
					className = {`flex items-center gap-3 ${portfolioVisibility ? "button-orange" : ""}`}
					onClick = {() => onUpdateVisibility(true)}
					>
						Public 
						<i className={`fa fa-eye`}/>
					</button>
					<button 
					className = {`flex items-center gap-3 ${!portfolioVisibility ? "button-orange" : ""}`}
					onClick = {() => onUpdateVisibility(false)}
					>
						Private
						<i className={`fa fa-eye-slash`}/>
					</button>
				</div>
			  )}
	  
			  <div className="profileHeader">
				<img
				  src={profileUser.profileImage}
				  alt={`Image of ${profileUser.first_name}`}
				  className={"rounded-md"}
				/>
				<h2>{profileUser.first_name + ' ' + profileUser.last_name}</h2>
				<h3>{profileUser.email}</h3>
			  </div>
	  
			  {/* Sidebar carousel */}
			  	<Portfolio portfolioItems = {portfolio.items} isEditable={true} />
	
				<TextEditor initialValue = {portfolio.description} onValueSubmit = {onTextSubmit}/>
			</div>
		  )}
		</>
	  );
}
