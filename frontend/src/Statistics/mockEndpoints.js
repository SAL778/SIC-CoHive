export function getPeakTimes(day, room) {
    return (
        {
            name: room,
            bookings: {
                8: 5,
                9: 4,
                10: 5,
                11: 13,
                12: 11,
                13: 16,
                14: 23,
                15: 24,
                16: 22,
                17: 17,
                18: 13,
                19: 7,
                20: 2
            },
            hours: 87
        }
    )
}

export function getResourcePopularity() {
    return (
        { popularity:[
            {
                name: "Podcast Room",
                hours: 21
            },
            {
                name: "Meeting Room",
                hours: 16
            },
            {
                name: "Loop",
                hours: 8
            },
            {
                name: "Art Station A",
                hours: 13
            },
            {
                name: "Art Station B",
                hours: 18
            },
            {
                name: "Localhost:5173",
                hours: 59
            },
            {
                name: "Conference Room A",
                hours: 18
            },
            {
                name: "Conference Room B",
                hours: 12
            },
            {
                name: "Quad Loop", 
                hours: 0
            },
            {
                name: "Camera Studio",
                hours: 25
            }
        ]}
    )
}