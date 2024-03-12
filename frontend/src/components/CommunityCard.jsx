import React from "react";

function CommunityCard({ userID, firstName, lastName, imageUrl }) {
	const defaultImage = "./src/assets/community-person.jpg";

	return (
		<a href={`/users/${userID}`} className="community-card bg-white rounded-lg">
			<img
				className="w-full shadow-custom"
				src={imageUrl || defaultImage}
				alt={`${firstName} ${lastName}`}
			/>
			<div className="card-info">
				<p className="info-first text-navy-blue text-lg font-semibold">
					{firstName}
				</p>
				<p className="info-last text-orange-500 text-lg font-semibold">
					{lastName}
				</p>
			</div>
		</a>
	);
}

export default CommunityCard;