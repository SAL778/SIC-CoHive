import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/sic_logo.png";
import Underlay from "../assets/Underlay.svg";
import { Link, NavLink } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import Signout from "../Signout";

// -----------------------------------------------------------------------------
/**
 * Handles the click event for the Navbar component.
 * @param {DOMRect} rect - The DOMRect object of the clicked nav element.
 * @returns {void} - Nothing.
 * Changes the location of the underlay to the clicked element by setting the CSS top position.
 */
// TODO: fix the way the underlay is positioned when the page is resized, or attach it to the active nav item better
// function handleClick(rect) {
// 	const yPos = rect.y;
// 	const underlay = document.querySelector(".nav-underlay");
// 	underlay.style.top = `${yPos}px`;
// }
// -----------------------------------------------------------------------------

/**
 * Renders a navigation item with a link, icon, and content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.content - The content to display for the navigation item.
 * @param {string} props.href - The URL to navigate to when the item is clicked.
 * @param {React.Component} props.icon - The icon component to display for the navigation item.
 * @returns {JSX.Element} The rendered navigation item.
 */
function NavItem({ content, href, icon }) {
	return (
		<NavLink
			to={href}
			className="nav-item flex h-[65px] grow items-center gap-2 text-sm font-medium flex-none justify-start px-6 py-3"
			// Styling for the active navigation item and hovers are in the css file
			// onClick={(e) => handleClick(e.currentTarget.getBoundingClientRect())}
		>
			<i
				className={`fa ${icon}`}
				style={{ fontSize: "20px", width: "30px", textAlign: "center" }}
			></i>
			<p className="block">{content}</p>
		</NavLink>
	);
}
// -----------------------------------------------------------------------------

/**
 * Renders the navigation component.
 *
 * @returns {JSX.Element} The navigation component.
 */
function Navigation({ mobileNav, setMobileNav }) {
	// The navigation items to display in the component at the top.
	// Pass the font awesome icon class name as a string, without the "fa" class.
	const objects = [
		{ content: "Bookings", href: "/bookings", icon: "fa-calendar-week" },
		{ content: "Events", href: "/events", icon: "fa-handshake-simple" },
		{ content: "Community", href: "/community", icon: "fa-user-group" },
		{
			content: "Statistics",
			href: "/statistics",
			icon: "fa-square-poll-vertical",
		},
	];

	// Component at the bottom.
	const additionalLinks = [
		{ content: "Profile", href: "/profile", icon: "fa-user-circle" },
		{ content: "Contact", href: "/feedback", icon: "fa-paper-plane" },
	];

	const signOut = {
		content: "Sign Out",
		href: "/signout",
		icon: "fa-sign-out-alt",
	};

	// The active navigation item state and setter.
	const [activeNavItem, setActiveNavItem] = useState(null);
	const handleClick = (index) => {
		setActiveNavItem(index);
	};

	const [showModal, setShowModal] = useState(false);

	const navigationRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				navigationRef.current &&
				!navigationRef.current.contains(event.target)
			) {
				setMobileNav(false);
			}
		}

		if (mobileNav) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [mobileNav, setMobileNav]);

	return (
		<>
			{/* Navigation */}
			<div
				ref={navigationRef}
				id="app-nav"
				className={`flex-none z-10 ${mobileNav ? "mobileOpen" : ""}`}
			>
				<div className="flex h-full flex-col bg-white rounded-[12px] shadow-custom">
					<a
						href="/bookings"
						className="mb-2 flex h-30 items-end rounded-[12px] bg-white p-4 justify-center"
					>
						<img
							className="object-center"
							src={logo}
							alt="SIC logo"
							width={250}
							height={40}
							referrerPolicy="no-referrer"
						/>
					</a>
					<div className="flex grow justify-between flex-col">
						{/* NOTE: commented out until the positioning is fixed */}
						{/* <img src={Underlay} className="nav-underlay" referrerPolicy="no-referrer"/> */}
						<div className="nav-container">
							{objects.map((object, index) => (
								<React.Fragment key={object.content}>
									<NavItem
										content={object.content}
										href={object.href}
										icon={object.icon}
										onClick={() => handleClick(index)}
									/>
								</React.Fragment>
							))}
						</div>
						<div className="nav-container">
							{additionalLinks.map((link, index) => (
								<React.Fragment key={link.content}>
									<NavItem
										content={link.content}
										href={link.href}
										icon={link.icon}
										onClick={() => handleClick(index)}
									/>
								</React.Fragment>
							))}
							<button
								onClick={() => setShowModal(true)}
								className="nav-item flex h-[65px] grow items-center gap-2 text-sm font-medium flex-none justify-start px-6 py-3"
							>
								<i
									className="fa fa-sign-out-alt"
									style={{
										fontSize: "20px",
										width: "30px",
										textAlign: "center",
									}}
								/>
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Signout */}
			<Signout opened={showModal} onClose={() => setShowModal(false)} />
		</>
	);
}
// -----------------------------------------------------------------------------
export default Navigation;
