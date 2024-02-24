import logo from "../assets/sic.png";
import { NavLink } from "react-router-dom";
// import { Link } from "react-router-dom";

import {
	CalendarCheck,
	Ticket,
	UsersThree,
	ChartBar,
	UserCircle,
	ChatCircleDots,
	SignOut,
} from "@phosphor-icons/react";

function Links() {
	const objects = [
		{ content: "Bookings", href: "/bookings", icon: CalendarCheck },
		{ content: "Events", href: "/events", icon: Ticket },
		{ content: "Community", href: "/community", icon: UsersThree },
		{ content: "Statistics", href: "/statistics", icon: ChartBar },
	];

	var allLinks = [];
	// loop through, don't need to use .map()
	for (let object of objects) {
		const Icons = object.icon;
		allLinks.push(
			<NavLink
				key={object.content}
				to={object.href}
				className={({ isActive }) =>
					`flex h-[48px] grow items-center justify-center gap-2 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 ${
						isActive
							? "bg-dark-orange text-white"
							: "bg-white hover:bg-orange-200 hover:text-orange-800"
					}`
				}
			>
				<Icons
					width="24px"
					height="24px"
					className={({ isActive }) => (isActive ? "text-white" : "text-black")}
				/>
				<p
					className={({ isActive }) =>
						isActive ? "md:block text-white" : "md:block"
					}
				>
					{object.content}
				</p>
			</NavLink>
		);
	}
	return <div>{allLinks}</div>;
}

export default function Navigation() {
	const additionalLinks = [
		{ content: "Profile", href: "/profile", icon: UserCircle },
		{ content: "Feedback", href: "/feedback", icon: ChatCircleDots },
		{ content: "Sign Out", href: "/signout", icon: SignOut },
	];

	return (
		<div className="flex h-full flex-col px-3 py-4">
			<a
				className="mb-2 flex h-20 items-end rounded-md bg-white p-4 shadow-md"
				href="/"
			>
				<div>
					<img
						className="object-center"
						src={logo}
						alt="SIC logo"
						width={250}
						height={40}
					/>
				</div>
			</a>
			<div className="flex grow flex-row justify-between space-x-2 shadow-md md:flex-col md:space-x-0">
				<Links />
				<div className="hidden h-auto w-full grow bg-white md:block"></div>
				{/* testing out .map() */}
				{additionalLinks.map((link) => (
					<NavLink
						key={link.content}
						to={link.href}
						className={({ isActive }) =>
							`flex h-[48px] w-full grow items-center rounded-md justify-center gap-2 bg-white shadow-md p-3 text-sm font-medium ${
								isActive
									? "bg-dark-orange text-white"
									: "hover:bg-orange-200 hover:text-orange-800"
							} md:flex-none md:justify-start md:p-2 md:px-3`
						}
					>
						<link.icon
							width="24px"
							height="24px"
							className={({ isActive }) =>
								isActive ? "text-white" : "text-black"
							}
						/>
						<div className="hidden md:block">{link.content}</div>
					</NavLink>
				))}
			</div>
		</div>
	);
}
