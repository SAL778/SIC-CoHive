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
			<button><span className = "text-orange-600 bold">Edit</span> fields of study</button>
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

export default ProfileHeading