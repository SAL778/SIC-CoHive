import React, {useContext, useEffect, useState} from "react";
import Chart from "react-apexcharts"
import { httpRequest } from "./utils";
import { HostContext } from "./App";


function Statistics() {

	const { host } = useContext(HostContext)
	const loadingMessage = "Compiling data, hold on tight"

	//Keys -> Front facing labels
	//Values -> Backend endpoint param
	const timeScopes = {"daily": "day", "weekly": "week", "monthly": "month", "yearly": "years", "All": "all"}
	const assetTypes = {"rooms": "room", "equipment": "equipment"}

	const [chartData, setChartData] = useState([])
	const [chartLabels, setChartLabels] = useState([])
	const [cardData, setCardData] = useState([])

	//Endpoint Params
	const [selectedAsset, setSelectedAsset] = useState(assetTypes.rooms);
	const [timeScope, setTimeScope] = useState(timeScopes.daily);

	const [isLoading, setIsLoading] = useState(true); //Only have to wait during the initial render

	//Make a GET to the backend
	useEffect(() => {
		//Set the series and options labels
		httpRequest({
			endpoint: `${host}/bookings/statistics/?q=...`,
			onSuccess: (statisticsData) => {
				setChartData(doSomething(statisticsData))
				setChartLabels(doSomehingElse(statisticsData))
				setCardData(doSomethingElser(statisticsData))
			}
		})
		setIsLoading(false)
	}, [selectedAsset, timeScope])

	return (
		<div>
			<ButtonGroup
				className = "timeToggles"
				options = {timeScopes}
				onBtnClick = {setSelectedAsset}
			/>

			<ButtonGroup
				clasName = "assetToggles"
				options = {assetTypes}
				onBtnClick = {setTimeScope}
			/>

			<div>
				{ !isLoading ? (
					<Chart
						options = {chartLabels} 	//Labels
						series = {chartData} 	//Data
						type = "bar"
						width = "500"
					/>
				):(	
					<>
						<Loader/>
						<p>{loadingMessage}</p>
					</>
				)} 
			</div>

			<div className = "statCards grid">
				{cardData.map(datum => (
					<StatCard 
					title = {datum.title} 
					content = {datum.content}
					/>
				))}
			</div>
		</div>
	);
}

/**Renders a button group for toggling data in the graph
 * 
 * @param {Object || Array} options - An object of label: value pairs, or a list if label and values are shared.
 * @param {function} onBtnClick - A callable that specifies what to do when a button is clicked. 
 * @returns 
 */
function ButtonGroup({options, onBtnClick}) {
	const [selectedButton, setSelectedButton] = useState(Object.keys(options)[0])

	const toRender = Array.isArray(options) ? options : Object.keys(options)

	const changeButton = (key) => {
		//Limit action on different button only.
		if (selectedButton !== key) {
			setSelectedButton(key)		//Change local style
			onBtnClick(key)	//Update parent state
		}
	}

	return (
		<div className="relative overflow-hidden">
			{ toRender.map((key, index) => (
				<button type="button" onClick = {() => changeButton(key)}>
					{key}
				</button>
			))}
			{/* <span className="backgroundSlider"></span> */}
		</div>
	)
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
