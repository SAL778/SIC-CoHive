import React, {useContext, useEffect, useState} from "react";
import { PeakTimesChart, ResourcePopularityChart } from "./Charts";
import { httpRequest } from "../utils";
import { HostContext } from "../App";
import { ButtonGroup } from "./Button";
import { getMiscStats } from "./mockEndpoints";
import { MonthPickerInput, YearPickerInput } from '@mantine/dates'

import '../components/Forms/form.css'

function Statistics() {

	const { host } = useState(HostContext)
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

	//Load the static card data (not affected by toggles)
	useEffect(() => {
		//TODO: Connect
		// httpRequest({
		// 	endpoint: `${host}/statistics/misc`,
		// 	onSuccess: (miscStatData) => {
		// 		console.table(miscStatData)
		// 		setCardData(res)
		// 	}
		// })

		const res = getMiscStats()
		setCardData([
			{
				icon: "fa fa-user-graduate",
				label: "Students Innovating", 
				value: res.totalUsers
			},
			{	
				icon: "fa fa-calendar",
				label: "Total Bookings",
				value: res.totalBookings
			},
			{	
				icon: "fa fa-clock",
				label: "Average Booking Time",
				value: `${res.averageBookingDuration} minutes`
			}])
	}, [])

	//Endpoint Params
	const [selectedAssetType, setSelectedAssetType] = useState(assetTypes[0]);
	const [selectedTimeScope, setSelectedTimeScope] = useState(timeScopes[0]);
	const [selectedYear, setSelectedYear] = useState(new Date().getYear()); //Years since 1900, default to this year
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); //Default to this month

	//Props shared between the month and year pickers
	//Defined as function so the disabled prop is computed when prop is updated
	const commonTimePickerProps = () => (
		{
			disabled: selectedTimeScope.value == 'all',
			placeholder: (selectedTimeScope.value == 'all') ? "Showing all time" : "Pick a date",
			//Default to no value if either isn't supplied
			//Month zero indexed
			value: (!!selectedYear && !!selectedMonth && selectedTimeScope.value !== 'all') ? new Date(selectedYear + 1900, selectedMonth, 1) : null,
		}
	)

	const [isLoading, setIsLoading] = useState(false); //Only have to wait during the initial render

	return (
		<div className="w-full">	
			<section className="heading flex min-h-0 gap-auto my-8 justify-between">
				<div>
					<h1 className="text-orange-600 text-5xl font-bold capitalize">{selectedTimeScope.label}</h1>
					<h2 className="text-neutral-400 text-2xl font-medium capitalize">Statistics</h2>
				</div>

				<div className="toggles flex gap-8">
					<div className="timePicker">
						<ButtonGroup
							//Preserve the existing month/year between swaps; don't reset the time values.
							className = "timeRangeToggles"
							options = {timeScopes}
							onButtonClick = {setSelectedTimeScope}
						/>
						{ (selectedTimeScope.value == 'month')
							? <MonthPickerInput
								{...commonTimePickerProps()}
								className="bg-white"
								onChange={(value) => {
									//console.log(value)
									setSelectedYear(value.getYear())
									setSelectedMonth(value.getMonth())
								}}
								maxLevel = "year"
							/>
							: <YearPickerInput
								{...commonTimePickerProps()}
								className="bg-white"
								onChange={(value) => {
									setSelectedYear(value.getYear())
								}}
								maxLevel = "decade"
							/>
						}
					</div>

					<ButtonGroup
						className= "assetToggles"
						options = {assetTypes}
						onButtonClick = {setSelectedAssetType}
					/>
				</div>
			</section>
				
			<section className = "grid gap-4 grid-cols-3 grid-rows-9">
				<div className = "bg-white rounded-md p-6 row-span-4 col-span-2 shadow-custom">
					<PeakTimesChart
						timeScope = {selectedTimeScope}
						assetType = {selectedAssetType}
						selectedYear = {selectedYear}
						selectedMonth = {selectedMonth}
					/>
				</div>
				<div className = "bg-white rounded-md p-6 row-span-4 col-span-1 shadow-custom">
					<ResourcePopularityChart
						timeScope = {selectedTimeScope}
						assetType = {selectedAssetType}
						selectedYear = {selectedYear}
						selectedMonth = {selectedMonth}
					/>
				</div>
				<div className = "row-span-1 col-span-3 flex flex-row gap-4">
					{cardData.map(datum => (
						<StatCard
						className = "flex-1 bg-white rounded-md"
						title = {datum.label} 
						content = {datum.value} 
						icon={datum.icon}
						/>
					))}
				</div>
			</section>
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
function StatCard({title, content, icon = null, className}) {
	//TODO: Style this
	return (
		<div className = {`${className} relative overflow-hidden shadow-custom p-6`}>
			<h2 className = "text-xl text-neutral-600 font-regular z-10 mb-6">{title}</h2>
			<p className = "text-5xl text-orange-600 font-extrabold z-10">{content}</p>
			{icon && 
				<i className = {`${icon} text-[#ededed] text-[128px] absolute -translate-x-12`}/>
			}
		</div>
	)
}

export default Statistics;
