import React, {useContext, useEffect, useState} from "react";
import { PeakTimesChart } from "./Charts";
import { httpRequest } from "../utils";
import { HostContext } from "../App";
import { ButtonGroup } from "./Button";


function Statistics() {
	const loadingMessage = "Compiling data, hold on tight"

	const timeScopes = [
		{value: "month", label: "monthly"},
		{value: "year", label: "yearly"},
		{value: "all", label: "all time"}
	]
	
	const assetTypes = [
		{value: "room", label: "rooms"},
		{value: "equipment", label: "equipment"}
	]

	//There are additional cards from /misc.
	const [cardData, setCardData] = useState([])

	//Endpoint Params
	const [selectedAssetType, setSelectedAssetType] = useState(assetTypes[0]);
	const [selectedTimeScope, setSelectedTimeScope] = useState(timeScopes[0]);

	const [isLoading, setIsLoading] = useState(false); //Only have to wait during the initial render

	return (
		<div className="w-full">	
			<section className="heading flex min-h-0 gap-auto my-8 justify-between">
				<div>
					<h1 className="text-orange-600 text-5xl font-bold capitalize">{selectedTimeScope.label}</h1>
					<h2 className="text-neutral-400 text-2xl font-medium capitalize">Statistics</h2>
				</div>

				<div className="toggles flex gap-8">
					<ButtonGroup
						className = "timeToggles"
						options = {timeScopes}
						onButtonClick = {setSelectedTimeScope}
					/>

					<ButtonGroup
						className= "assetToggles"
						options = {assetTypes}
						onButtonClick = {setSelectedAssetType}
					/>
				</div>
			</section>
				
			<section className = "grid gap-4 grid-cols-3 grid-rows-4">
				<div className = "bg-white rounded-md p-6 row-span-2 col-span-2">
					<PeakTimesChart
						timeScope = {selectedTimeScope.label}
						assetType = {selectedAssetType.label}
					/>
				</div>
				
			</section>

			{/* <div className = "statCards grid">
					{cardData.map(datum => (
						<StatCard 
						title = {datum.title} 
						content = {datum.content}
						/>
					))}
				</div> */}
		</div>
	);
}

/**Renders a card for other statistics. 
 * 
 * @param {string} title - The statistic tracked
 * @param {string} content - The statistic text
 * @param {string} icon - A string representing a fontawesome class.
 * @returns 
 */
function StatCard({title, content, icon = null}) {
	//TODO: Style this
	return (
		<div className = "statCard">
			<h2>{title}</h2>
			<p>{content}</p>
			{icon && 
				<i className = {icon}/>
			}
		</div>
	)
}

export default Statistics;
