//Messy -- needs to be refactored


import React, {useState } from "react";
import Modal from "react-modal";
import Carousel from "../../../src/components/Carousel/Carousel.jsx";

import { Info } from "@phosphor-icons/react";

Modal.setAppElement("#root");

/**
 * getContextUser function returns the current session user
 * @returns {Object} - Returns a object represeenting the current session user 
 */
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


/**
 * UserRoles component renders a list of user roles.
 * @param {Array} props.roles - An array containing role strings
 * @returns {JSX.Element} - Returns a JSX element representing the user roles.
 */
function UserRoles({roles}) {
	if (roles?.length) {
		return (
			<ul className = "flex flex-wrap gap-2">
				{roles.map((role) => <li key = {role} className="border-4 p-3 border-sky-700 rounded-md">{role}</li>)}
			</ul>
		)
	}
	return (<p className = "text-neutral-500 text-xs font-light">"No roles assigned yet."</p>)
}

/**
 * FieldOfStudy component represents a field of study, including its name and whether it is a major or minor.
 * @param {string} props.fieldName - The name of the field of study.
 * @param {string} props.minormajor - Indicates whether the field of study is a major or minor.
 * @returns {JSX.Element} - Returns a JSX element representing the field of study.
 */
function FieldOfStudy({fieldName, minormajor}) {
	return (
		<li key = {fieldName} className = "flex justify-between p-3 border-4 rounded-md relative">
			<span className = "capitalize align-middle">{fieldName}</span>
			<span className = "text-xs font-bold uppercase align-bottom">{minormajor}</span>
			<span className = "absolute top-0 right-0">Icon</span>
		</li>
	)
}

/**
 * Renders Educational Background as a list of field studies.
 * @param {string} props.education - list containing field of study and major, minor
 * @returns {JSX.Element} - Returns a JSX element representing the educational background
 * @see {FieldOfStudy} - as child component
 */
function EducationBackground({education}) {
	//Unsure of education shape for now
	//TODO: Replace the education shape with proper backend shape.
	return (
		<>
			<ul>
				{education.map((field) => <FieldOfStudy fieldName = {field[0]} minormajor = {field[1]}  />)}
			</ul>
			<button><span className = "text-orange-500 bold">Edit</span> fields of study</button>
		</>
	)
}


/**
 * Renders The biographic information of the user.
 * @param {string} props.user - user object
 * @returns {JSX.Element} - Returns a JSX element representing the user's biographic information
 * @see {EducationBackground} - as child component
 * @see {UserRoles} - as child component
 */
function ProfileHeading({user}) {
	return (
		// Profile head container
		<div className = "profileHead gap-7 flex flex-row w-2/3 h-fit"> 
		{/* <div className = "profileHead gap-7 flex flex-row w-2/3 h-fit">  */}
			<div className = "nameSection flex flex-row gap-8 p-8 bg-neutral-100 w-2/3 rounded-3xl">
			{/* <div className = "nameSection flex flex-row gap-8 p-8 bg-neutral-100 w-2/3 rounded-3xl"> */}
				<img src = {user.profile} className = "w-64 h-64 object-cover rounded-3xl"/> 
				{/* Figma img size 256 by 256 */}
				<div className="username flex flex-col">
					<span className="first text-blue-950 text-3xl font-semibold">{user.first}</span>
					<span className="last text-orange-500 text-3xl font-light">{user.last}</span>
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


/**
 * Renders The portfolion information of a user
 * @param {string} props.user - user object
 * @returns {JSX.Element} - Returns a JSX element representing the user's biographic information
 * @see {Carousel} - as child component
 */
function Portfolio({user}) {
	//TODO: Replace icons

	const isContextUser = getContextUser().id == user.id

	//Modal Stuff
	//==============

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [clickedObject, setClickedObject] = useState(null); //clickedObject is an object containing content, and the index of its position in the list
	const [portfolioList, setPortfolioList] = useState(user.portfolio.items); //The individual portfolio pieces

	const openModal = (content, index) => {
		setClickedObject({content, index})
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setClickedObject(null)
		setModalIsOpen(false)
	}

	const deletePortfolioItem = (clickedObject) => {
		if (clickedObject) {
			console.log(clickedObject)
			//TODO:
			//Send this change to backend, do NOT update the filter list on error.
			setPortfolioList(portfolioList.filter((item, index) => index !== clickedObject.index))
			closeModal()
		}
	}

	//The rendered representation of the data.
	const PortfolioCard = ({portfolioItem, index}) => {
		return (
			<div className = 
				"group text-orange-500 hover:text-white bg-white hover:bg-orange-600 neutral-50 \
				p-5 rounded-md h-60 w-56 group flex flex-col place-content-between \
				ease-out duration-500 delay-100">
				<span>Icon Here</span>
				<div>
					<h1 className = "text-xl font-bold first-letter:uppercase">{portfolioItem.title}</h1>
					<h2 className = "text-l text-neutral-800 font-normal ease-out duration-500 group-hover:text-neutral-950">{portfolioItem.desc}</h2>
				</div>
				<div className = "buttonFooter flex flex-row place-content-between ease-in-out ">
					<div className = "modifyButtons space-x-4 opacity-0 group-hover:opacity-100 duration-500">
						<button type = "button" className = "hover:text-neutral-300" onClick={() => openModal(portfolioItem, index)}>Del</button>
						<button type = "button" className = "hover:text-neutral-300">Edit</button>
					</div>
					<a href = {portfolioItem.url} className = "self-end">→</a>
				</div>
			</div>
		)
	}

	//Map information to a JSX component
	let slides = portfolioList.map((item, index) =>
		<PortfolioCard key = {index} portfolioItem = {item} index = {index}/>
	)

	//Feed slides as array of JSX components
	if (isContextUser || user.isVisible) {
		return (
			<div className = "align-items-start w-auto">
				<h2>About</h2>
				<p>{user.portfolio.desc}</p>
				<Carousel
					slides = {slides}
					options = {{ align: 'start'}}
				/>
				<Modal
					className = "delModal h-screen flex justify-center items-center flex-col backdrop-brightness-50 backdrop-blur-sm"
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					contentLabel="Delete Confirmation Modal"
				>
					<div className = "modalContainer flex flex-col space-y-4 bg-white rounded-lg p-5">
						<h2 className = "text-xl font-medium text-blue-950">Are you sure that you want to delete <span className="text-orange-500 font-bold">{clickedObject?.content.title}?</span></h2>
						<div className="footer-buttons flex flex-row justify-end gap-3">
							<button type = "button" className = "text-neutral-600" onClick= {closeModal}>Nevermind</button>
							<button type = "button" className = "bg-orange-600 p-3 rounded-md text-white" onClick= {() => deletePortfolioItem(clickedObject)}>Yes, Delete it</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}

	return <p text-neutral-500>Nothing to see here!</p>
}

function Profile() {
	// This tells us who's currently using the app (from the context)
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
			["economics", "minor"],
			["business", "minor"]
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
					title: "working with B",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
				{
					title: "working with C",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
				{
					title: "working with D",
					desc: "working with B",
					url: "https://tailwindcss.com/",
					icon: "tailwind",
				},
				{
					title: "working with E",
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

//export default Profile;
