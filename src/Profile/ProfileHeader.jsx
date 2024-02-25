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
			<p>{education.major} <span>Major</span></p>
            <p>{education.minor} <span>Minor</span></p>

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
		<div className = "profileHead gap-7 flex flex-row h-fit"> 
			<div className = "nameSection flex flex-row gap-8 p-8 bg-neutral-100 w-2/3 rounded-3xl">
                <div className = "flex flex-col">
                    <img src = {user.profileImage} className = "w-64 h-64 object-cover rounded-3xl"/> 
                    { user.is_staff && 
                        <div>
                            <i class="fa fa-shield"/>
                            <p>Student Innovation Center Admin</p>
                        </div>
                    }
                </div>
                <div className="username flex flex-col">
                    <span className="first text-blue-950 text-3xl font-semibold">{user.first_name}</span>
                    <span className="last text-orange-600 text-3xl font-light">{user.last_name}</span>
                </div>
			</div>

			<div className = "detailSection p-8 bg-neutral-100 rounded-3xl w-1/3 flex flex-col gap-3">
				<>
					<h6 className = "text-neutral-800 text-s font-regular">
						Roles
						<i className="fa fa-info"/>
					</h6>
                    {user.roles
                        ? <UserRoles roles = {user.userRoles}/>
                        : <p className = "text-neutral-500">This person has no assigned roles yet</p>
                    }   
				</>
				<>
					<h6>
						Education Background
					</h6>
					<EducationBackground education = {user.educations}/>
				</>
			</div>
		</div>
	)
}

export default ProfileHeading