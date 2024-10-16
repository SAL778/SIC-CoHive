import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/sic_logo.png";
import { Link, NavLink } from "react-router-dom";
import Signout from "../Signout";

function NavItem({ content, href, icon, target }) {
	return (
		<NavLink
			to={href}
			target={target}
			className="nav-item flex h-[65px] grow items-center gap-2 text-sm font-medium flex-none justify-start px-6 py-3"
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
		{
			content: "Discord",
			href: "https://discord.gg/yfbf2FaFX8",
			icon: "fa-brands fa-discord",
		},
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
										target={link.content === "Discord" ? "_blank" : "_self"}
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
