import React, { useState, useEffect, useContext } from "react";
import Portfolio from "./Portfolio.jsx";
import ProfileHeader from "./ProfileHeader.jsx";
import { UserContext } from "../App.jsx";

export default function Profile() {
	//const [userData, setUserData] = useState(null);
	const { user, setUser } = useContext(UserContext);

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
					setLoading(false);
				} else {
					console.error("Failed to fetch user data:", response.statusText);
				}
			} catch (error) {
				console.error("Unexpected error:", error);
			}
		};

		fetchUserData();
	}, []);

	// // Wait until userData is available before rendering ProfileHeader
	// if (!userData) {
	// 	return null; // or render a loading indicator
	// }

	return (
		<>
  			{loading ? (
    			<div>Loading...</div>
  			) : (
				<div className="flex flex-col gap-4 overflow-auto px-0 py-[30px] max-w-[2000px] mx-auto">
					<ProfileHeader user={user} />
					<Portfolio portfolio={mockPortfolio} isCurrentUser={true} />
				</div>
			)}
		</>
	);
}

const mockPortfolio = {
	description: "Hello welcome to my blog",
	items: [
		{
			id: 1,
			icon: "fa-react",
			title: "React App",
			description: "Made with Vite and Bootstrap",
			link: "https://google.com/",
			portfolio: 0,
		},
		{
			id: 2,
			icon: "fa-vue",
			title: "Vue App",
			description: "Made with Vue and Chakra",
			link: "https://google.com/",
			portfolio: 0,
		},
		{
			id: 3,
			icon: "fa-youtube",
			title: "Chess AI Showcase",
			description: "Tensorflow and lots of tears",
			link: "https://google.com/",
			portfolio: 0,
		},
		{
			id: 4,
			icon: "fa-youtube",
			title: "Trackmania AI Showcase",
			description: "Cars",
			link: "https://google.com/",
			portfolio: 0,
		},
		{
			id: 5,
			icon: "fa-youtube",
			title: "Spinning",
			description: "Cars",
			link: "https://google.com/",
			portfolio: 0,
		},
		{
			id: 6,
			icon: "fa-youtube",
			title: "Weaving",
			description: "Inverse Basket Weave with Willow fibers",
			link: "https://google.com/",
			portfolio: 0,
		},
	],
};
