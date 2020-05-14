import { useMutation, useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { AddTradeBoardShift } from '../API/Mutations/Shifts'
import { GetAllUsers, GetUserByID } from '../API/Queries/User'
import { AuthContext } from '../Components/Auth'
import { GetBlackouts } from './../API/Queries/Blackout'
import { Card, TitleText } from './../Styles/StyledComponents'
moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

let blackoutDays = []

export default function Overview(props) {

    //states or variables  such as 
    // myShifts = to be rendered in the calendar (can be dropped)
    // otherShifts = to be rendered in the calendar
    // blackoutDates = to be rendered in the calendar (prevent shift dropping in this period)
    const [myShifts, setMyShifts] = useState([])
    const [otherShifts, setOtherShifts] = useState([])
    const [blackoutDates, setBlackoutDates] = useState([])

    const { user } = useContext(AuthContext);
    let userID = localStorage.getItem('currentUserID')

    const { loading, error, data, refetch, networkStatus } = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true
        }
    )


    const {
        loading: loading2,
        error: error2,
        data: data2,
        refetch: refetch2,
        networkStatus: netStat2,
    } = useQuery(GetBlackouts)

    const {
        loading: loading3,
        error: error3,
        data: data3,
        refetch: refetch3,
        networkStatus: netStat3,
    } = useQuery(GetAllUsers)

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

    useEffect(() => {

        //onCompleted data = user data from API call GetUserByID
        const onCompleted = data => {
            let temp = []
            data.getUserByID.shifts.forEach(({ start, end, ...rest }) => {
                //Changing string to date object to be rendered in the calendar
                let startDate = new Date(start)
                let endDate = new Date(end)
                temp.push({ start: startDate, end: endDate, ...rest, myShift: true })
            })
            //setting state
            setMyShifts(temp)
        }

        //onCompleted data2 = blackout data from API call GetBlackouts
        const onCompleted2 = data2 => {
            let temp = []
            data2.getBlackouts.forEach(({ start, end }) => {
                //Changing string to date object to be rendered in the calendar
                let startDate = new Date(start)
                let endDate = new Date(end)
                temp.push({ start: startDate, end: endDate })
            })

            temp.forEach(({ start, end }) => {
                blackoutDays.push(...getDates(start, end))
            })
            //setting state
            setBlackoutDates(temp)
        }

        //onCompleted data3 = all users data from API call GetAllUsers
        const onCompleted3 = data3 => {
            let otherUsers = data3.getUsers.filter(({ _id }) => _id !== user._id)
            let otherShifts = []
            otherUsers.forEach(({ shifts }) => {
                shifts.forEach((item) => {
                    //Changing string to date object to be rendered in the calendar
                    item.start = new Date(item.start)
                    item.end = new Date(item.end)
                    otherShifts.push({ ...item, myShift: false })
                })
            })
            //setting state
            setOtherShifts(otherShifts)
        }


        if (!loading && !error) onCompleted(data)
        if (!loading2 && !error2) onCompleted2(data2)
        if (!loading3 && !error3) onCompleted3(data3)
    }, [loading, data, error, loading2, data2, error2])

    const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

    const [shiftsToPush] = useMutation(AddTradeBoardShift)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( {JSON.stringify(error)}</p>
    if (networkStatus === 4) return <p>Refetching...</p>




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
                const isUnableToBeDropped = blackoutDays.some((blackoutDate) => {
                    return blackoutDate.toDateString() === event.start.toDateString() || blackoutDate.toDateString() === event.end.toDateString()
                })

                if (!isUnableToBeDropped) {
                    //API call to add the shift to the tradeboard
                    shiftsToPush({
                        variables: { userID: userID, shiftID: event._id },
                    })

                    //modifying state so that user can see the difference that indicates the shift 
                    //is available on the tradeboard
                    let tempShift = [...myShifts]
                    tempShift.forEach((item) => {
                        if (item._id === event._id) item.available = true
                    })
                    //re-render by setting the new user's shift
                    setMyShifts(tempShift)
                }
                else {
                    alert('You are unable to drop your shift on this day.')
                }
            }
        }

    }

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

    return (
        <Card style={{
            width: '1500px'
        }}>
            <div>
                <TitleText style={{
                    textAlign: 'left',
                    position: 'flex',
                    fontSize: '48px',

                }}>Overview</TitleText>
                <DraggableCalendar
                    selectable
                    localizer={localizer}
                    events={myShifts.concat(otherShifts)}
                    views={['month', 'week']}
                    defaultView={Views.WEEK}
                    defaultDate={new Date(2020, 2, 30)}
                    onSelectEvent={handleDrop}
                    style={{ height: '80vh', width: '1450px' }}
                    dayPropGetter={handleBlackoutDate}
                    eventPropGetter={event => ({
                        style: {
                            backgroundColor: event.available ? 'darkred' : event.myShift ? 'green' : event.color,
                            alignSelf: 'center',
                            alignContent: 'center'
                        }
                    })}
                    slotPropGetter={() => ({
                        style: {
                            border: 'none',
                            alignItems: 'center'
                        }
                    })}
                    components={{
                        event: Event
                    }}
                />
            </div>
        </Card>
    )
}