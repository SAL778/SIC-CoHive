export default function ProfileHeader({profileUser}) {
    return (
        <div className="profileHeader">
				<img
				  src={profileUser.profileImage}
				  alt={`Image of ${profileUser.first_name}`}
				  className={"rounded-md"}
				/>
				<h2>{profileUser.first_name + ' ' + profileUser.last_name}</h2>
				<h3>{profileUser.email}</h3>
			  </div>
    )

}