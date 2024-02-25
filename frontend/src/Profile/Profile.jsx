import React, { useState } from "react";
import Portfolio from "./Portfolio.jsx"
import ProfileHeader from "./ProfileHeader.jsx";


const mockPortfolio = 
	{
		description: "Hello welcome to my blog",
		items:[
			{
				"id": 1,
				"icon": "fa-react",
				"title": "React App",
				"description": "Made with Vite and Bootstrap",
				"link": "https://google.com/",
				"portfolio": 0
			},
			{
				"id": 2,
				"icon": "fa-vue",
				"title": "Vue App",
				"description": "Made with Vue and Chakra",
				"link": "https://google.com/",
				"portfolio": 0
			},
			{
				"id": 3,
				"icon": "fa-youtube",
				"title": "Chess AI Showcase",
				"description": "Tensorflow and lots of tears",
				"link": "https://google.com/",
				"portfolio": 0
			},
			{
				"id": 4,
				"icon": "fa-youtube",
				"title": "Trackmania AI Showcase",
				"description": "Cars",
				"link": "https://google.com/",
				"portfolio": 0
			},
			{
				"id": 5,
				"icon": "fa-youtube",
				"title": "Spinning",
				"description": "Cars",
				"link": "https://google.com/",
				"portfolio": 0
			},
			{
				"id": 6,
				"icon": "fa-youtube",
				"title": "Weaving",
				"description": "Inverse Basket Weave with Willow fibers",
				"link": "https://google.com/",
				"portfolio": 0
			},
		]
	}



export default function Profile() {

	//GET the information for the user
	const getUser = () => {
		return ( {
			"id": 0,
			"username": "hBjdlXoc+P01-Uf0kFMalrO.xX6tlU.IHecZFPZSbofccN_u_GlHQVp@JutXh+RwcOC-KI-0NYyndJI7jBeLrQl-A6Wa",
			"first_name": "Joseph",
			"last_name": "Ghreeling",
			"email": "user@example.com",
			"is_staff": true,
			"is_superuser": true,
			"is_active": true,
			"date_joined": "2024-02-25T01:08:59.016Z",
			"last_login": "2024-02-25T01:08:59.016Z",
			"portfolioVisibility": true,
			"profileImage": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"educations": [
			  {
				"field_of_study": "string",
				"major": "Computing Science",
				"minor": "Economics"
			  }
			]
		})
	}

	return (
		<div className = "flex flex-col gap-4">
			<ProfileHeader user = {getUser()}/>
			<Portfolio portfolio = {mockPortfolio} isCurrentUser = {true}/>
		</div>
		
	)
}