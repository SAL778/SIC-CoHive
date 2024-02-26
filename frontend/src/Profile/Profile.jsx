import React, { useState, useEffect, useContext } from "react";
import Portfolio from "./Portfolio.jsx";
import ProfileHeader from "./ProfileHeader.jsx";
import { HostContext, UserContext } from "../App.jsx";

export default function Profile() {
	//const [userData, setUserData] = useState(null);
	const { user, setUser } = useContext(UserContext);
	const { host } = useContext(HostContext);

	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);

	function getCookieValue(cookieName) {
		const cookies = document.cookie.split("; ");
		for (const cookie of cookies) {
			const [name, value] = cookie.split("=");
			if (name === cookieName) {
				return value;
			}
		}
		return null;
	}

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
					const sanitizedUser = JSON.parse(JSON.stringify(user), (key, value) =>
						value === null ? "" : value
					);
					setUser(sanitizedUser);
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
								// Fetch portfolio (incl. items)
								response.json().then(portfolio => {
									//console.log(portfolio)
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
				} else {
					console.error("Failed to fetch user data:", response.statusText);
				}
			} catch (error) {
				console.error("Unexpected error:", error);
			}
		};

		fetchUserData();
	}, []);

	return (
		<>
  			{loading  ? (
    			<div>Loading...</div>
  			) : (
				<div className="flex flex-col gap-4 overflow-auto px-0 py-[30px] max-w-[2000px] mx-auto">
					<ProfileHeader user={user} />
					<Portfolio portfolio={portfolio} isCurrentUser={true} />
				</div>
			)}
		</>
	);
}