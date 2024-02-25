import React, { useState } from "react";
import Portfolio from "./Portfolio.jsx"

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
		return null
	}

	return (

		<Portfolio portfolio = {mockPortfolio}/>
	)
}