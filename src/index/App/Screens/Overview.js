import { useMutation, useQuery } from '@apollo/react-hooks'
import React, { useContext, useEffect, useState } from 'react'
import { AddTradeBoardShift } from '../API/Mutations/Shifts'
import { GetAllUsers } from '../API/Queries/User'
import { AuthContext } from '../Components/Auth'
import { GetBlackouts } from './../API/Queries/Blackout'
import { Card, TitleText,SubtitleText } from './../Styles/StyledComponents'
import { ErrorAlert } from './../Components/Alerts'
import LoadingSpinner from './../Components/LoadingSpinner'
import MyCalendar from './../Components/Calendar'

let blackoutDays = []

export default function Overview(props) {
    //states or variables  such as
    // myShifts = to be rendered in the calendar (can be dropped)
    // otherShifts = to be rendered in the calendar
    // blackoutDates = to be rendered in the calendar (prevent shift dropping in this period)
    const [myShifts, setMyShifts] = useState([])
    const [otherShifts, setOtherShifts] = useState([])
    const [blackoutDates, setBlackoutDates] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user } = useContext(AuthContext)

    useEffect(() => {
        //When the screen loads
        if (myShifts.length === 0) {
            const formattedShifts = user.shifts.map(
                ({ start, end, ...rest }) => {
                    //Changing string to date object to be rendered in the calendar
                    let startDate = new Date(start)
                    let endDate = new Date(end)
                    return {
                        start: startDate,
                        end: endDate,
                        ...rest,
                        myShift: true,
                    }
                }
            )
            //setting state
            setMyShifts(formattedShifts)
        }
    }, [myShifts, user])

    const { loading: loadingBlackouts } = useQuery(GetBlackouts, {
        onError({ message }) {
            setError({ title: 'Error Fetching Blackout Dates!', message })
        },
        //onCompleted data2 = blackout data from API call GetBlackouts
        onCompleted({ getBlackouts }) {
            const temp = getBlackouts.map(({ start, end }) => {
                //Changing string to date object to be rendered in the calendar
                let startDate = new Date(start)
                let endDate = new Date(end)
                return { start: startDate, end: endDate }
            })

            temp.forEach(({ start, end }) => {
                blackoutDays.push(...getDates(start, end))
            })
            //setting state
            setBlackoutDates(temp)
        },
    })

    const { loading: loadingAllUsers } = useQuery(GetAllUsers, {
        onError({ message }) {
            setError({ title: "Error Fetching All Users' Shifts!", message })
        },
        //onCompleted getUsers = all users data from API call GetAllUsers
        onCompleted({ getUsers }) {
            let otherUsers = getUsers.filter(({ _id }) => _id !== user._id)
            let otherShifts = []
            otherUsers.forEach(({ shifts }) => {
                shifts.forEach((shift) => {
                    //Changing string to date object to be rendered in the calendar
                    shift.start = new Date(shift.start)
                    shift.end = new Date(shift.end)
                    otherShifts.push({ ...shift, myShift: false })
                })
            })
            //setting state
            setOtherShifts(otherShifts)
        },
    })

    useEffect(() => {
        if (loadingBlackouts || loadingAllUsers) setLoading(true)
        else setLoading(false)
    }, [loadingAllUsers, loadingBlackouts])

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }

    /*
    Function Name: getDates
    Parameter: startDate - beginning of the specific period
                stopDate - end of the specific period

    this function is used for blackout dates to get the difference on start and end  to be rendered in the calendar
    */
    function getDates(startDate, stopDate) {
        var dateArray = new Array()
        var currentDate = startDate
        while (currentDate <= stopDate) {
            dateArray.push(new Date(currentDate))
            currentDate = currentDate.addDays(1)
        }
        return dateArray
    }

    const [shiftsToPush] = useMutation(AddTradeBoardShift)

    const renderCalendar = () => {
        //render function that indicates that specific period is blacked out
        // by iterating blackout state
        const handleBlackoutDate = (date) => {
            for (let i in blackoutDates) {
                let blackoutStartDate = blackoutDates[i].start
                let blackoutStartDate2 = blackoutDates[i].end
                let arr = getDates(blackoutStartDate, blackoutStartDate2)
                for (let x in arr) {
                    if (
                        date.getDate() === arr[x].getDate() &&
                        date.getMonth() === arr[x].getMonth() &&
                        date.getFullYear() === arr[x].getFullYear()
                    ) {
                        return {
                            style: {
                                backgroundColor: '#000',
                            },
                        }
                    }
                }
            }
        }
        /*
            Function Name: handleDrop
            Parameter: event - calendar event when the user click on a specific event

            Handle drop the user's shift, 
            validation = 1. can't drop other users' shift,  
                        2. can't drop shift on the blackout period
            */
        const handleDrop = (event) => {
            //validation 1
            if (event.myShift) {
                const check = window.confirm(
                    '\nDo you want to drop this shift: Ok - YES, Cancel - NO'
                )
                if (check) {
                    //validation 2
                    const isUnableToBeDropped = blackoutDays.some(
                        (blackoutDate) => {
                            return (
                                blackoutDate.toDateString() ===
                                    event.start.toDateString() ||
                                blackoutDate.toDateString() ===
                                    event.end.toDateString()
                            )
                        }
                    )

                    if (!isUnableToBeDropped) {
                        //API call to add the shift to the tradeboard
                        shiftsToPush({
                            variables: { userID: user._id, shiftID: event._id },
                        })

                        //modifying state so that user can see the difference that indicates the shift
                        //is available on the tradeboard
                        let tempShift = [...myShifts]
                        tempShift.forEach((item) => {
                            if (item._id === event._id) item.available = true
                        })
                        //re-render by setting the new user's shift
                        setMyShifts(tempShift)
                    } else {
                        alert('You are unable to drop your shift on this day.')
                    }
                }
            }
        }
        return (
            <MyCalendar
                events={myShifts.concat(otherShifts)}
                dayPropGetter={handleBlackoutDate}
                onSelectEvent={handleDrop}
            />
        )
    }

    return (
        <Card
            style={{
                width: '95%',
            }}
        >
            <div>
            <TitleText style={{
                    textAlign: 'left',
                    position: 'flex',
                    fontSize: '3.2rem',
                }}>Overview</TitleText>
            <SubtitleText>Here you may view your weekly work schedule. </SubtitleText>
            <br />
            <br />
                {error && (
                    <ErrorAlert error={error} onClose={() => setError(false)} />
                )}
                {loading ? (
                    <LoadingSpinner style={{ height: '100vh' }} />
                ) : (
                    renderCalendar()
                )}
            </div>
        </Card>
    )
}
