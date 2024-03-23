export default function ProfileHeader({profileUser}) {
    console.log(profileUser)

    return (
        <div className="profileHeader flex">
            <img
                src={profileUser.profileImage}
                alt={`Image of ${profileUser.first_name}`}
                className={"rounded-md mr-4"}
            />
            <div className="flex flex-col">
                <h2 className = "text-neutral-800 text-3xl font-bold">{profileUser.first_name + ' ' + profileUser.last_name}</h2>
                <h3 className = "text-neutral-600 text-lg">{profileUser.email}</h3>

                {!profileUser.isStaff && 
                    <span className="text-orange-600 font-semibold">
                        <i className="fa fa-shield mr-2"/>
                        Admin
                    </span>
                }
            </div>
		</div>
    )

}