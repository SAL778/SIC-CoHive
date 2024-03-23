import { useState, useContext } from "react";
import { HostContext, UserContext } from "../../App.jsx";
import { getCookieValue } from "../../utils.js";
/**
 * UserRoles component renders a list of user roles.
 * @param {Array} props.roles - An array containing role strings
 * @returns {JSX.Element} - Returns a JSX element representing the user roles.
 */

function UserRoles({ accessTypes }) {
	const getRandomColor = () => {
		// Generates a random hex color.
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	if (accessTypes?.length) {
		return (
			<ul className="flex flex-wrap gap-2">
				{accessTypes.map((accessType, index) => (
					<li
						key={accessType.name}
						// style={{ "--tag-color": getRandomColor() }}   //uncomment for random colors
						style={{ "--tag-color": "#EA580C" }}
						className="roleTag flex flex-row items-center justify-center"
					>
						{accessType.name}
					</li>
				))}
			</ul>
		);
	}
	return (
		<p className="text-neutral-500 text-xs font-light">
			"No roles assigned yet."
		</p>
	);
}

/**
 * Renders Educational Background as a list of field studies.
 * @param {string} props.education - list containing field of study and major, minor
 * @returns {JSX.Element} - Returns a JSX element representing the educational background
 * @see {FieldOfStudy} - as child component
 */
function EducationBackground({ education }) {
	const { currentUser: user } = useContext(UserContext);
	const { host } = useContext(HostContext);

	const [major, setMajor] = useState(education?.major || "");
	const [minor, setMinor] = useState(education?.minor || "");
	// const [isUpdated, setIsUpdated] = useState(false);
	const [isMajorUpdated, setIsMajorUpdated] = useState(false);
	const [isMinorUpdated, setIsMinorUpdated] = useState(false);

	const handleMajorChange = (event) => {
		setMajor(event.target.value);
		setIsMajorUpdated(true);
	};

	const handleMinorChange = (event) => {
		setMinor(event.target.value);
		setIsMinorUpdated(true);
	};

	const handleEducationChangeSubmit = async (education, fieldToChange) => {
		const accessToken = getCookieValue("access_token");
		try {
			const response = await fetch(`${host}/users/${user.id}/`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Token ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					education: { [fieldToChange]: education.toString() },
				}),
			});

			if (response.ok) {
				console.log("Sent successfully");
				if (fieldToChange === "major") {
					setIsMajorUpdated(false);
				} else if (fieldToChange === "minor") {
					setIsMinorUpdated(false);
				}
			} else {
				console.log("Couldn't send", response.statusText);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const isMajorButtonDisabled = !(isMajorUpdated && major !== education?.major);
	const isMinorButtonDisabled = !(isMinorUpdated && minor !== education?.minor);

	return (
		<>
			{/* MAJOR */}
			<div className="education-input flex flex-row justify-between items-center gap-4">
				<div className="education-cap">
					<i className="fa-solid fa-graduation-cap"></i>
					<span>Major</span>
				</div>
				<input
					type="text"
					value={major}
					placeholder="Major"
					className="rounded-lg border-3 gap-2"
					onChange={handleMajorChange}
				/>
				<button
					className={`square-button ${
						!isMajorButtonDisabled ? "changed-education" : ""
					}`}
					onClick={() => handleEducationChangeSubmit(major, "major")}
					disabled={isMajorButtonDisabled}
				>
					<i className="fa-solid fa-arrow-right"></i>
				</button>
			</div>

			{/* MINOR */}
			<div className="education-input flex flex-row justify-between items-center gap-4">
				<div className="education-cap">
					<i className="fa-solid fa-graduation-cap"></i>
					<span>Minor</span>
				</div>
				<input
					type="text"
					value={minor}
					placeholder="Minor"
					className="rounded-lg border-3 gap-2"
					onChange={handleMinorChange}
				/>
				<button
					className={`square-button ${
						!isMinorButtonDisabled ? "changed-education" : ""
					}`}
					onClick={() => handleEducationChangeSubmit(minor, "minor")}
					disabled={isMinorButtonDisabled}
				>
					<i className="fa-solid fa-arrow-right"></i>
				</button>
			</div>
		</>
	);
}

/**
 * Renders The biographic information of the user.
 * @param {string} props.user - user object
 * @returns {JSX.Element} - Returns a JSX element representing the user's biographic information
 * @see {EducationBackground} - as child component
 * @see {UserRoles} - as child component
 */
function ProfileHeader({ user }) {
	return (
		// Profile head container
		<div className="profileHead gap-7 flex flex-row h-fit px-[20px]">
			<div className="nameSection relative flex flex-row gap-6 p-0 bg-white w-2/3 border-custom shadow-custom max-h-[315px] pr-[40px]">
				<img
					src={user.profileImage}
					className="profileImg w-[315px] h-[315px] object-cover"
				/>
				<div className="username flex flex-col py-[40px]">
					<span className="first text-blue-950 text-[38px] leading-[46px] font-bold">
						{user.first_name}
					</span>
					<span className="last text-orange-500 text-[38px] leading-[46px] font-light">
						{user.last_name}
					</span>
				</div>
				{user.is_staff && (
					<div className="absolute bottom-[40px] right-[40px] inline-flex items-center gap-[8px] text-[22px] text-orange-500">
						<i className="fa-solid fa-shield-halved"></i>
						<p>Student Innovation Center Admin</p>
					</div>
				)}
			</div>

			<div className="detailSection p-[16px] bg-white border-custom w-1/3 flex flex-col justify-center items-center gap-3 shadow-custom max-h-[315px]">
				<div className="flex flex-col justify-between gap-[20px] w-[80%]">
					<>
						<h6
							className="text-base font-medium text-[18px] leading-4 tracking-normal text-left flex flex-row gap-[6px] items-center"
							title="Roles indicate access to special resources"
						>
							Roles
							<i className="fa-solid fa-circle-info"></i>
						</h6>
						{user.roles ? (
							<UserRoles accessTypes={user.accessType} />
						) : (
							<p className="text-neutral-500">
								This person has no assigned roles yet
							</p>
						)}
					</>
					<>
						<h6 className="text-base font-medium text-[18px] leading-4 tracking-normal text-left">
							Education Background
						</h6>
						<EducationBackground education={user.education} />
					</>
				</div>
			</div>
		</div>
	);
}

function Badge({ userType }) {
	if (userType == "organization") {
		return (
			<span>
				<i className="fa fa-building" />
				Organization
			</span>
		);
	} else if (userType == "admin") {
		return (
			<span>
				<i className="fa fa-admin" />
				Student Innovation Center{" "}
			</span>
		);
	}
}

export default ProfileHeader;
