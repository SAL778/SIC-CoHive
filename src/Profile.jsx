import React from "react";
import Carousel from "./components/Carousel/Carousel.jsx";

import { Info } from "@phosphor-icons/react"

function getContextUser() {
	//TODO: Return user from context
	const mockContextUser = {
		id: 12,
		first: "Steve",
		last: "Holt",
		profile: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		userRoles: ["Audio Engineer", "Graphic Designer", "VFX Artist"],
		userType: "Admin",
		education: [
			["computing science", "major"],
			["economics", "minor"]
		],
		isVisible: false,
	}

	return mockContextUser
}

function UserRoles({roles}) {
	/**
	 * roles: string[]
	 */
	if (roles?.length) {
		return (
			<ul className = "flex flex-wrap gap-2">
				{roles.map((role) => <li key = {role} className="border-4 p-3 border-sky-700 rounded-md">{role}</li>)}
			</ul>
		)
	}
	return (<p className = "text-neutral-500 text-xs font-light">"No roles assigned yet."</p>)
}

function FieldOfStudy({fieldName, minormajor}) {
	return (
		<li key = {fieldName} className = "flex justify-between p-3 border-4 rounded-md relative">
			<span className = "capitalize align-middle">{fieldName}</span>
			<span className = "text-xs font-bold uppercase align-bottom">{minormajor}</span>
			<span className = "absolute top-0 right-0">Icon</span>
		</li>
	)
}

function EducationBackground({education}) {
	/**
	 * education: Not sure the shape of this yet
	 * TODO: Replace this with the proper object retrieved from backend
	 */
	return (
		<>
			<ul>
				{education.map((field) => <FieldOfStudy fieldName = {field[0]} minormajor = {field[1]}  />)}
			</ul>
			<button><span className = "text-orange-600 bold">Edit</span> fields of study</button>
		</>
	)
}

function ProfileHeading({user}) {
	/**
	 * user: User object (defer to UML for shape)
	 */

	return (
		<div className = "profileHead gap-7 flex flex-row w-2/3 h-fit">

			<div className = "nameSection flex flex-row gap-8 p-8 bg-neutral-100 w-2/3 rounded-3xl">
				<img src = {user.profile} className = "w-64 h-64 object-cover rounded-3xl"/>
				<div className="username flex flex-col">
					<span className="first text-blue-950 text-3xl font-semibold">{user.first}</span>
					<span className="last text-orange-600 text-3xl font-light">{user.last}</span>
				</div>
			</div>

			<div className = "detailSection p-8 bg-neutral-100 rounded-3xl w-1/3 flex flex-col gap-3">
				<>
					<h6 className = "text-neutral-800 text-s font-regular">
						Roles
						<Info color = "#A3A3A3" weight="fill" size={24} className="inline"/>
					</h6>
					<UserRoles roles = {user.userRoles}/>
				</>

				<>
					<h6>
						Education Background
					</h6>
					<EducationBackground education = {user.education}/>
				</>
			</div>
		</div>
	)
}

function Portfolio({user}) {
	const isContextUser = getContextUser().id == user.id

	const PortfolioCard = ({portfolioItem}) => {
		return (
			<div className = 
				"text-orange-600 hover:text-white bg-white hover:bg-orange-600 neutral-50 \
				p-5 rounded-md h-60 w-56 group flex flex-col place-content-between \
				ease-out duration-500 delay-100">
				<span>Icon Here</span>
				<div>
					<h1 className = "text-xl font-bold first-letter:uppercase">{portfolioItem.title}</h1>
					<h2 className = "text-l text-neutral-800 font-normal ease-out duration-500 delay-100 group-hover:text-neutral-950">{portfolioItem.desc}</h2>
				</div>
				<div className = "buttonFooter flex flex-row place-content-between">
					<div className = "modifyButtons space-x-2">
						<button>Del</button>
						<button>Edit</button>
					</div>

					<a href = {portfolioItem.url} className = "self-end">→</a>
				</div>
			</div>
		)
	}

	const slides = user.portfolio.items.map((item, index) =>
		<PortfolioCard key = {index} portfolioItem = {item}/>
	)

	if (isContextUser || user.isVisible) {
		return (
			<div className = "align-items-start w-auto">
				<h2>About</h2>
				<p>{user.portfolio.desc}</p>
				<Carousel
					slides = {slides}
					options = {{ align: 'start'}}
				/>
			</div>
		)
	}

	return <p text-neutral-500>Nothing to see here!</p>
}

function Profile() {

	// This tells use who's currently using the app (from the context)
	const currentInstanceUser = getContextUser()

	// This is who the profile belongs to
	const mockUser = {
		id: 12,
		first: "Steve",
		last: "Holt",
		profile: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		userRoles: ["Audio Engineer", "Graphic Designer", "VFX Artist"],
		userType: "Admin",
		education: [
			["computing science", "major"],
			["economics", "minor"]
		],
		isVisible: false,
		portfolio: {
			desc: "lorem sit dolor amet",
			items: [
				{
					title: "working with X",
					desc: "working with Y",
					url: "https://google.com",
					icon: "drive",
				},
				{
					title: "working with A",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
				{
					title: "working with A",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
				{
					title: "working with A",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
				{
					title: "working with A",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
				{
					title: "working with A",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
			]

		}
	}

	return (
		<div className = "flex flex-col w-full items-center p-8">
			<ProfileHeading user = {mockUser}/>
			<Portfolio user = {mockUser}/>
		</div>
	);
}

export default Profile;
