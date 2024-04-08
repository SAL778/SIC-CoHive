import React, { useState, useEffect, useContext } from "react";
import { HostContext, UserContext } from "../App.jsx";
import { httpRequest } from "../utils.js";
import { Routes, Route, useParams } from "react-router-dom";
import { Loader } from "@mantine/core";
import { TextEditor } from "./TextEditor.jsx";
import Portfolio from "./PortfolioCarousel.jsx";
import {
	ErrorNotification,
	SuccessNotification,
} from "../components/notificationFunctions.js";
import ProfileHeader from "./ProfileHeader.jsx";
import FlairList from "./Flairs.jsx";
import { Tooltip } from "@mantine/core";

export default function ViewProfile() {
	const { profileUserId } = useParams(); //Used to GET the profile
	const [profileUser, setProfileUser] = useState({}); //Current user's profile
	const [isLoading, setLoading] = useState(true);
	const { host } = useContext(HostContext);
	const [portfolio, setPortfolio] = useState(null);

	//Get the user data
	useEffect(() => {
		httpRequest({
			endpoint: `${host}/users/${profileUserId}/`,
			onSuccess: (userData) => {
				setProfileUser(userData);
				if (userData.portfolioVisibility) {
					//Another request is portfolio is set to visible
					httpRequest({
						endpoint: `${host}/users/${userData.id}/portfolio/`,
						onSuccess: (portfolioData) => {
							setPortfolio(portfolioData);
							setLoading(false);
						},
					});
				} else {
					setLoading(false);
				}
			},
		});
	}, []);

	return isLoading ? (
		<Loader />
	) : (
		<div className="content-container flex flex-col gap-8 w-full my-[30px] max-w-[1600px] mx-auto">
			<ProfileHeader profileUser={profileUser} />

			<div className="px-[10px]">
				<h2 className="text-lg text-neutral-800 font-medium mt-0 mb-[10px]">
					User Tags
					<Tooltip label="These tags are set by the user to describe themselves.">
						<i className="fa fa-info-circle ml-2" />
					</Tooltip>
				</h2>
				<FlairList
					flairs={profileUser.flair_roles.map((type) => type.role_name)}
					isEditable={false}
				/>
				<h2 className="text-lg text-neutral-800 font-medium mt-[32px] mb-[10px]">
					Student Innovation Centre Roles
					<Tooltip label="This is what the user does at the SIC and controls room access.">
						<i className="fa fa-info-circle ml-2" />
					</Tooltip>
				</h2>
				<FlairList
					flairs={profileUser.accessType.map((type) => type.name)}
					isEditable={false}
					isAccessRoles
				/>
			</div>

			{!!portfolio ? (
				<>
					<Portfolio portfolioItems={portfolio.items} isEditable={false} />
					<TextEditor initialValue={portfolio.description} readOnly={true} />
				</>
			) : (
				<p className="px-[10px]">Sorry, this portfolio is private. Nothing to see here!</p>
			)}
		</div>
	);
}
