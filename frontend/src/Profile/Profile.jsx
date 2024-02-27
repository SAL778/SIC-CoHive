import React, { useState, useEffect, useContext } from "react";
import Portfolio from "./Portfolio.jsx";
import ProfileHeader from "./ProfileHeader.jsx";
import { HostContext, UserContext } from "../App.jsx";
import { getCookieValue } from "../utils.js"

export default function Profile() {
	//const [userData, setUserData] = useState(null);
	const { user, setUser } = useContext(UserContext);
	const { host } = useContext(HostContext);

	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const accessToken = getCookieValue("access_token");
				const response = await fetch("http://localhost:8000/users/profile", {
					method: "GET",
					credentials: "include",
					headers: {
						Authorization: `Token ${accessToken}`,
					},
				});

				if (response.ok) {
					const user = await response.json();
					setUser(user);
					console.log(user)
					//TODO: Distinguish between fetched user and current user (from context?)
					//Now we do the portfolio call, if it's private, skip.
					if (user.portfolioVisibility) {
						fetch(`${host}/users/${user.id}/portfolio/`, {
							method: "GET",
							headers: {
								accept: "application/json"
							}
						})
						.then(response => {
							if (response.ok) {
								response.json().then(portfolio => {
									setPortfolio(portfolio)
									setLoading(false);
								}
									)
							}
							else {
								console.log("Couldn't fetch portfolio description", response.statusText);
							}
						});
					}
					else {
						setLoading(false);
					}
				} else {
					console.error("Failed to fetch user data:", response.statusText);
				}
			} catch (error) {
				console.error("Unexpected error:", error);
			}
		};

		fetchUserData();
	}, []);

	const changePortolioVisibility = async () => {
		try {
			const accessToken = getCookieValue("access_token");
			const response = await fetch(`${host}/users/${user.id}/`, { 
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Token ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ "portfolioVisibility": !user.portfolioVisibility }),
			});

			if (response.ok) {
				const user = await response.json();
				setUser(user);
			} else {
				console.error("Failed to change portfolio visibility:", response.statusText);
			}
		} catch (error) {
			console.error("Unexpected error:", error);
		}
	}

	return (
		<>
  			{loading  ? (
    			<div>Loading...</div>
  			) : (
				
				<div className="flex flex-col gap-4 overflow-auto px-0 py-[30px] max-w-[2000px] mx-auto">
					<ProfileHeader user={user} />
					<button type="button" className="button-orange px-[20px]" onClick = {() => changePortolioVisibility()}>Change Visibility </button>
					{user.portfolioVisibility && <Portfolio portfolio={portfolio} isCurrentUser={true} />}
				</div>
			)}
		</>
	);
}