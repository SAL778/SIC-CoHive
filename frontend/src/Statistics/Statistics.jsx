import React, {useContext, useEffect, useState} from "react";
import { PeakTimesChart, ResourcePopularityChart } from "./Charts";
import { httpRequest } from "../utils";
import { HostContext } from "../App";
import { ButtonGroup } from "./Button";
import { MonthPickerInput, YearPickerInput } from '@mantine/dates'

import '../components/Forms/form.css'

function Statistics() {

	const { host } = useContext(HostContext)
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
		httpRequest({
			endpoint: `${host}/bookings/statistics/misc/`,
			onSuccess: (miscStatData) => {
				console.table(miscStatData)
				setCardData([
					{
						icon: "fa fa-user-graduate",
						label: "Students Innovating", 
						value: miscStatData.TotalUsers
					},
					{	
						icon: "fa fa-calendar",
						label: "Total Bookings",
						value: miscStatData.TotalRoomBookings + miscStatData.TotalEquipmentBookings
					},
					{	
						icon: "fa fa-clock",
						label: "Average Booking Time",
						value: `${Math.round(miscStatData.averagEbookingDurationHour)} minutes`
					}])
			}
		})
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
		<div className="parent-container-stats content-container w-full max-w-[1600px] mx-auto px-[10px] pb-[10px] overflow-hidden">	
			<section className="heading-stats flex gap-8 mb-8 justify-between">
				<div>
					<h1 className="text-orange-600 text-5xl font-bold capitalize">{selectedTimeScope.label}</h1>
					<h2 className="text-2xl font-medium capitalize">Statistics</h2>
				</div>

				<div className="togglesWrap flex gap-4">
					<div className="timePicker bg-none">
						<ButtonGroup
							//Preserve the existing month/year between swaps; don't reset the time values.
							className = "timeRangeToggles"
							options = {timeScopes}
							onButtonClick = {(selection) => {
								setSelectedTimeScope(selection)
							}}
						/>
						{ (selectedTimeScope.value == 'month')
							? <MonthPickerInput
								{...commonTimePickerProps()}
								className="bg-white shadow-custom"
								onChange={(value) => {
									//console.log(value)
									setSelectedYear(value.getYear())
									setSelectedMonth(value.getMonth())
								}}
								maxLevel = "year"
							/>
							: <YearPickerInput
								{...commonTimePickerProps()}
								className="bg-white shadow-custom"
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
				
			<section className = "flex gap-4 flex-col">
				<div className="stats-top-section grid">
					<div className = "peak-times h-fit">
						<PeakTimesChart
							timeScope = {selectedTimeScope}
							assetType = {selectedAssetType}
							selectedYear = {selectedYear}
							selectedMonth = {selectedMonth}
						/>
					</div>
					<div className = "resource-popularity h-auto">
						<ResourcePopularityChart
							timeScope = {selectedTimeScope}
							assetType = {selectedAssetType}
							selectedYear = {selectedYear}
							selectedMonth = {selectedMonth}
						/>
					</div>
				</div>
				<div className = "card-stats grid gap-4">
					{cardData.map(datum => (
						<StatCard
						className = "flex-1 bg-white rounded-[12px]"
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
	return (
		<div className = {`${className} flex flex-row justify-between items-start gap-6 relative overflow-hidden shadow-custom p-6`}>
			{icon && 
				<i className = {`${icon}`}/>
			}
			<div className="w-full">
				<h2 className = "card-stats-title font-medium text-blue-950">{title}</h2>
				<p className = "text-large-desktop text-orange-600 font-extrabold">{content}</p>
			</div>
		</div>
	)
}

export default Statistics;
