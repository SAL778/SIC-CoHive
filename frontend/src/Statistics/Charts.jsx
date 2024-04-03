import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts"
import { Select } from "@mantine/core";
import { httpRequest } from "../utils";
import { HostContext } from "../App";
import { getPeakTimes, getResourcePopularity } from "./mockEndpoints";
import './chart.css'
import { ButtonGroup } from "./Button";

const DAYS = [
    {value: 1, label: "Mo"},
    {value: 2, label: "Tu"},
    {value: 3, label: "We"},
    {value: 4, label: "Th"},
    {value: 5, label: "Fr"}
]

export function PeakTimesChart({timeScope, assetType}) {
    const { host } = useContext(HostContext)

    const [selectedDay, setSelectedDay] = useState([])

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
        const res = getPeakTimes(selectedDay, selectedAsset)
        setGraphLabels(Object.keys(res.bookings))
        setGraphData(Object.values(res.bookings))

    }, [selectedAsset, selectedDay, timeScope])

    return (
        <>
            <h2 className="text-3xl font-bold text-blue-950 capitalize">Peak {assetType.label || assetType} Booking Times</h2>
            <h3 className="text-neutral-500 text-lg capitalize mb-4">{timeScope.label || timeScope}</h3>
            <div className = "chartToggles mb-6 flex center-items gap-3">
                <Select
                    className="flex-1 font-medium"
                    data={dropdownContent}
                    allowDeselect={false}
                    checkIconPosition="right"
                    //defaultValue={selectedAsset} //Default asset
                    placeholder={`Select a${assetType.value == "equipment" ? "n equipment" : " room"}`}
                    onChange={(value) => setSelectedAsset(value)}
                    rightSection = {<i className="fa fa-caret-down text-orange-600"/>}
                    comboboxProps={{ transitionProps: { transition: 'skew-up', duration: 200 } }}
                />
                <ButtonGroup
                    className="flex-1"
                    options = {DAYS}
                    onButtonClick= {setSelectedDay}
                />

            </div>
        
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
                                download: true,
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
        const [selectedDay, setSelectedDay] = useState([])
        const { host } = useContext(HostContext)

        const [graphData, setGraphData] = useState([])     //Data points
        const [graphLabels, setGraphLabels] = useState([]) //X axis
        const [exportSettings, setExportSettings] = useState({}) //How the charts will be named when downloaded 

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
                <h2 className="text-3xl font-bold text-blue-950 capitalize">{assetType.label || assetType} Popularity</h2>
                <h3 className="text-neutral-500 text-lg capitalize mb-4">{timeScope.label || timeScope}</h3>
                <div className="mb-5">
                    <ButtonGroup
                        className="flex-1"
                        options = {DAYS}
                        onButtonClick= {setSelectedDay}
                    />
                </div>

                <ReactApexChart
                    type="donut"
                    series= {graphData}
                    width = "100%"  //Won't display properly w/o height/width set
                    height = "100%"
                    options = {{
                        labels: graphLabels,
                        chart: {
                            toolbar: {
                                show: true,
                                tools: {
                                    download: true
                                }
                            }
                        },
                        legend: {
                            show: true,
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "20em",
                            position: 'bottom',
                            showForZeroSeries: true,
                            horizontalAlign: 'left',
                            floating: false,
                            onItemClick: {
                                toggleDataSeries: false
                            },
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    offset: 0,
                                    minAngleToShowLabel: 10, //Degrees
                                },
                                expandOnClick: false,
                                donut: {
                                    size: '70%',
                                    labels: {
                                        show: true,
                                        name: {
                                            show: true,     //Inside the circle
                                        },
                                        value: {
                                            show: true,
                                            formatter: (value) => (
                                                `${value} hours`
                                            )
                                        },
                                        total: {
                                            fontWeight: "bold",
                                            fontSize: "1.4em",
                                            show: true,
                                            color: "#EA580C",
                                            showAlways: false,
                                            formatter: (w) => {
                                                console.table(w)
                                                const sum = w.globals.series.reduce((accumulator, v) => accumulator + v)
                                                return `${sum} hours`
                                            }
                                        }
                                    }
                                },
                                expandOnClick: false,
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            dropShadow: false,
                        }
                    }}
                />
            </>
        )
}
