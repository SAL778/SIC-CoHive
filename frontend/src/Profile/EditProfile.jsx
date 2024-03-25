import React, { useState, useEffect, useContext } from "react";
import { HostContext, UserContext } from "../App.jsx";
import { httpRequest } from "../utils.js";
import { Loader, Tooltip } from '@mantine/core';
import { TextEditor } from './TextEditor.jsx';
import Portfolio from './PortfolioCarousel.jsx'
import {ErrorNotification, SuccessNotification} from "../components/notificationFunctions.js";
import ProfileHeader from "./ProfileHeader.jsx";
import FlairList from "./Flairs.jsx";


export default function EditProfile() {

	// const { profileUserId } = useParams();										//Used to GET the profile
	// const currentUserId = JSON.parse(localStorage.getItem('currentUser'))["id"];	//Who's accessing the profile
	const [profileUser, setProfileUser] = useState({})								//Current user's profile		
	const { host } = useContext(HostContext);
	const { setCurrentUser } = useContext(UserContext);

	const [portfolio, setPortfolio] = useState([])
	const [portfolioVisibility, setPortfolioVisibility] = useState(profileUser.portfolioVisibility) 	//visibility toggle controls (only shows if current user is profile user)
	const [isLoading, setLoading] = useState(true)

	const onTextSubmit = (value) => {
		console.log(value)
		httpRequest({
			endpoint: `${host}/users/${profileUser.id}/portfolio/`,
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
				endpoint: `${host}/users/${profileUser.id}/`,
				method: 'PATCH',
				body: JSON.stringify({portfolioVisibility: visibility}),
				onSuccess: () => {
					console.dir(JSON.stringify({portfolioVisibility: visibility}))
					new SuccessNotification(
						'Changed visibility', 
						`Portfolio set to ${visibility ? "Public" : "Private"}`)
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
			endpoint: `${host}/users/profile/`,
			onSuccess: (userData) => {
				setProfileUser(userData);
				setCurrentUser(userData); //Add to the context so nested components can access
				httpRequest({
					endpoint: `${host}/users/${userData.id}/portfolio/`, // Always get portfolio
					onSuccess: (portfolioData) => {
						setPortfolio(portfolioData); // Expected: List
						setLoading(false);
					}
				});
			},
		});
	}, []);

	//Re-render when the portfolioData loads
	useEffect(() => {
		setPortfolioVisibility(profileUser.portfolioVisibility)
	}, [portfolio])

	return (
		<>
		  {isLoading ? (
			<Loader />
		  ) : (
			<div className="flex flex-col gap-8 w-full my-[30px] max-w-[1600px] mx-auto">
				<div className = "buttonToggleGroup w-auto flex justify-end px-[10px]">
					<div className="flex flex-row justify-between gap-3 items-center bg-white py-0 px-5 shadow-custom rounded-[5px] h-[64px]">
						<button 
						className = {`flex items-center gap-3 p-3 button-thin ${!portfolioVisibility ? "button-orange" : "button-clear"}`}
						onClick = {() => onUpdateVisibility(false)}
						>
							<p className="mobile-hidden">Private</p>
							<i className={`fa fa-eye-slash`}/>
						</button>
						<button 
						className = {`flex items-center gap-3 p-3 button-thin ${portfolioVisibility ? "button-orange" : "button-clear"}`}
						onClick = {() => onUpdateVisibility(true)}
						>
							<p className="mobile-hidden">Public</p>
							<i className={`fa fa-eye`}/>
						</button>
					</div>
				</div>
	  
				<ProfileHeader profileUser = {profileUser}/>

				<div className="px-[10px]">
					<FlairList flairs = {profileUser.flair_roles.map(type => type.role_name)} isEditable={true} />
						<h2 className = "text-lg text-neutral-800 font-medium mb-[10px]">Student Innovation Center Roles
							<Tooltip label = "This is what the user does at the SIC and controls room access.">
								<i className = "fa fa-info-circle ml-2"/>
							</Tooltip>
						</h2>
					<FlairList flairs = {profileUser.accessType.map(type => type.name)} isEditable={false} isAccessRoles/>
				</div>
	  
			  	{/* Sidebar carousel */}
			  	<Portfolio portfolioItems = {portfolio.items} isEditable={true} />

				<TextEditor initialValue = {portfolio.description} onValueSubmit = {onTextSubmit}/>
			</div>
		  )}
		</>
	  );
}
