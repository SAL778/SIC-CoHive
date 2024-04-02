import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts"
import { Select } from "@mantine/core";
import { httpRequest } from "../utils";
import { HostContext } from "../App";
import { getPeakTimes, getResourcePopularity } from "./mockEndpoints";
import './chart.css'

export function PeakTimesChart({timeScope, assetType}) {
    const { host } = useContext(HostContext)
    
    const days = [
        {value: 1, label: "Mo"},
        {value: 2, label: "Tu"},
        {value: 3, label: "We"},
        {value: 4, label: "Th"},
        {value: 5, label: "Fr"}
    ]

    const [selectedDays, setSelectedDays] = useState([])

    const [dropdownContent, setDropdownContent] = useState([])
    const [selectedAsset, setSelectedAsset] = useState("")

    const [graphData, setGraphData] = useState([])     //Data points
    const [graphLabels, setGraphLabels] = useState([]) //X axis

    //Get the data for the dropdown
    useEffect(() =>  {
        //console.log(assetType)
        httpRequest({
			endpoint: `${host}/bookings/resources/filter?type=${assetType.value}`,
			onSuccess: (data) => {
                console.table(data)
				setDropdownContent(data.map(datum => datum.name));
                setSelectedAsset(data[0]);
			},
		})
    }
    ,[assetType])

    //Get the data for the peak times (bar chart)
    useEffect(() => {
        //TODO: Connect
        // const queryParams = {asset: selectedAsset, days: "".join(selectedDays)}
        // httpRequest({
        //     endpoint: `${host}/statistics/peak?asset=${queryParams.asset}&${queryParams.days | ""}`,
        //     onSuccess: (statData) => {
        //         setGraphLabels(Object.keys(statData.bookings)) //Hour slots
        //         setGraphData(Object.values(statData.bookings)) //Times booked
        //     }
        // })
        const res = getPeakTimes(selectedDays, selectedAsset)
        setGraphLabels(Object.keys(res.bookings))
        setGraphData(Object.values(res.bookings))

    }, [selectedAsset, selectedDays, timeScope])

    return (
        <>
            <h2 className="text-3xl font-bold text-blue-950">Peak Room Booking Times</h2>
            <h3 className="text-neutral-500 text-lg capitalize mb-4">{timeScope.label || timeScope}</h3>
            <Select
                data={dropdownContent}
                allowDeselect={false}
                //defaultValue={selectedAsset} //Default asset
                placeholder={`Select a${assetType.value == "equipment" ? "n equipment" : " room"}`}
                onChange={(value) => setSelectedAsset(value)}
                rightSection = {<i className="fa fa-caret-down text-orange-600"/>}
                comboboxProps={{ transitionProps: { transition: 'skew-up', duration: 200 } }}
            />
            
            <ReactApexChart
                type="bar"
                series= {[{
                    name: "Bookings",
                    data: graphData,
                }]}
                options= {{
                    colors: ["#EA580C"],
                    chart: {
                        type: 'bar',
                        toolbar: {
                            tools: {
                                download: '<i className="fa fa-download text-orange-600 w-16 h-16"/>',
                            }
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false,
                        }
                    },
                    noData: {
                        text: 'Loading data',
                        align: 'center',
                        verticalAlign: 'middle'
                    },
                    xaxis: {
                        labels: {
                            formatter: (value) => {
                                const twelveFormat = (value == 12) ? value : value % 12
                                const timeOfDay = value >= 12 ? "PM" : "AM"

                                return `${twelveFormat} ${timeOfDay}`
                             }
                        },
                        categories: graphLabels
                    },
                    states: {
                        active: {
                          filter: {
                            type: 'none' //Disables shading on click
                          }
                        }
                      }
                }}            
            />
        </>
    )
}

export function ResourcePopularityChart({timeScope, assetType}) {
        const { host } = useContext(HostContext)

        const [graphData, setGraphData] = useState([])     //Data points
        const [graphLabels, setGraphLabels] = useState([]) //X axis
        //const [total, ]

        //Get the data for the room popularity (pie chart)
        useEffect(() => {
            // httpRequest({
            //     // endpoint: `${host}/statistics/popularity?asset=${queryParams.asset}&${queryParams.days | ""}`,
            //     // onSuccess: (statData) => {
            //     //     setGraphLabels(Object.keys(statData.bookings)) //Hour slots
            //     //     setGraphData(Object.values(statData.bookings)) //Times booked
            // })
            const res = getResourcePopularity(assetType, timeScope)

            setGraphLabels(res.popularity.map(resource => resource.name))
            setGraphData(res.popularity.map(resource => resource.hours))
        }, [timeScope, assetType])

        return (
            <>
                <ReactApexChart
                    type="donut"
                    series= {graphData}
                    width = "100%"
                    height = "100%"
                    options = {{
                        labels: graphLabels,
                        legend: {
                            show: true,
                            position: 'bottom',
                            showForZeroSeries: true,
                            horizontalAlign: 'left',
                            floating: false,
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    size: '70%',
                                    labels: {
                                        show: true,
                                        name: {
                                            show: true,
                                        }
                                    }
                                },
                                expandOnClick: false,
                            }
                        },
                        dataLabels: {
                            enabled: true
                        }
                    }}

                />
            </>
        )
}
