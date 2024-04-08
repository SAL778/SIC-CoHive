import defaultImage from "../assets/community-person.jpg";

export default function ProfileHeader({ profileUser }) {
	return (
		<div className="profileHeader flex px-[10px]">
			<img
				src={profileUser.profileImage || defaultImage}
				alt={`Image of ${profileUser.first_name}`}
				className={"rounded-lg mr-6 h-[96px] w-[96px] object-cover"}
				referrerPolicy="no-referrer"
			/>
			<div className="flex flex-col justify-between">
				<div className="flex flex-col">
					<h2 className="text-large-desktop text-neutral-800 font-bold mb-1">
						{profileUser.first_name + " " + profileUser.last_name}
					</h2>
					<h3 className="text-neutral-600 text-for-mobile">
						{profileUser.email}
					</h3>
				</div>
				{!!profileUser.is_staff && (
					<span className="text-orange-600 font-semibold">
						<i className="fa fa-shield mr-2" />
						SIC Admin
					</span>
				)}
			</div>
		</div>
	);
}
