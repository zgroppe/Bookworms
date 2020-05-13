import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import {
    Card,
    Hyperlink,
    PrimaryButton,
    SubtitleText,
    TextInput,
    TitleText,
} from './../Styles/StyledComponents'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../Styles/Schedule.css'
import { Swatch, Color } from '../Styles/StyledComponents'
import { HuePicker } from 'react-color'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { UpdateUsersShifts } from '../API/Mutations/Shifts'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GetUserByID, GetAllUsersId } from './../API/Queries/User'
import AutoPopulate from './../Functions/AutoPopulation'
import { UpdateUser } from './../API/Mutations/User'
import {CreateBlackout} from './../API/Mutations/Blackout'
import {GetBlackouts} from './../API/Queries/Blackout'

moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

export default function Schedule(props) {
    const [myEventsList, setMyEventsList] = useState([])
    const [colorPicked, setColorPicked] = useState('red')
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [blackoutStart, setBlackoutStart] = useState('')
    const [blackoutEnd, setBlackoutEnd] = useState('')
    const [AutoPopulationSchedule, setAutoPopulationSchedule] = useState([])
    const [blackoutDates, setBlackoutDates] = useState([])

    const [addBlackout] = useMutation(CreateBlackout)
    const userID = localStorage.getItem('currentUserID')
    const [updateShifts] = useMutation(UpdateUsersShifts)

    const { loading, error, data: userData, refetch, networkStatus } = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true,
        }
    )

    const {
        loading: loading2,
        error: error2,
        data: multipleUserData,
        refetch: refetch2,
        networkStatus: netStat2,
    } = useQuery(GetAllUsersId)

    const {
        loading: loading3,
        error: error3,
        data: data3,
        refetch: refetch3,
        networkStatus: netStat3,
    } = useQuery(GetBlackouts)

    //useEffect => what to do after the component is rendered
    useEffect(() => {
        //calling setMyEventsList to set hardcoded list
        setMyEventsList([
            {
                title: 'Employee 1',
                start: new Date(2020, 1, 23, 5),
                end: new Date(2020, 1, 23, 18),
                color: '#fc0373',
            },
            {
                title: 'Employee 3',
                start: new Date(2020, 1, 25, 10),
                end: new Date(2020, 1, 25, 16),
                color: '#18fc03',
            },
        ])

        const onCompleted = data3 => {
			let temp = []
			//console.log('GOT HERE')
			data3.getBlackouts.forEach(({start, end}) => {
                let startDate = new Date(start)
                let endDate = new Date(end)
                //console.log(startDate, '\n', endDate)
                temp.push({start: startDate, end: endDate})
                //console.log(temp)
            })
            //console.log(temp)
            setBlackoutDates(temp)
			//console.log(blackoutDates)
		}

        if (!loading3 && !error3) onCompleted(data3)

    }, [loading3, data3, error3])

    const handleSelect = ({ start, end }) => {
        const title = window.prompt('New Event name')
        if (title)
            setMyEventsList([
                ...myEventsList,
                { title, start, end, color: colorPicked && colorPicked.hex },
            ])
    }

    const handleColorChangeComplete = (color, event) =>
        setColorPicked(color, () => setDisplayColorPicker(!displayColorPicker))

    const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

    const moveEvent = ({ event, start, end }) => {
        let { title, color } = event
        let tempArr = myEventsList.filter((item) => item !== event)
        tempArr.push({ title, start, end, color })
        setMyEventsList(tempArr)
    }

    const resizeEvent = ({ event, start, end }) => {
        let index = myEventsList.indexOf(event)
        let { title, color } = event
        let tempArr = [...myEventsList]
        tempArr[index] = { title, color, start, end }
        setMyEventsList(tempArr)
    }

    const handleDelete = (event) => {
        const check = window.confirm(
            '\nDelete this event: Ok - YES, Cancel - NO'
        )
        if (check) {
            let deleteSpot = myEventsList.indexOf(event)
            let tempArray = [...myEventsList]
            tempArray.splice(deleteSpot, 1)
            setMyEventsList(tempArray)
        }
    }

    //Handles the coloring of blackout days
    const handleBlackoutDate = (date) => {
        ///console.log(blackoutDates)
        for(let i in blackoutDates)
        {
            //console.log(blackoutDates[i].start.toISOString(), '\n', blackoutDates[i].end.toISOString())
            let blackoutStartDate = blackoutDates[i].start
            let blackoutStartDate2 = blackoutDates[i].end

            Date.prototype.addDays = function (days) {
                var date = new Date(this.valueOf())
                date.setDate(date.getDate() + days)
                return date
            }

            function getDates(startDate, stopDate) {
                var dateArray = new Array()
                var currentDate = startDate
                while (currentDate <= stopDate) {
                    dateArray.push(new Date(currentDate))
                    currentDate = currentDate.addDays(1)
                }
                return dateArray
            }

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

    const renderBlackout = () => {
        const renderDatePicker = (statename, functionName) => {
            return (
                <DatePicker
                    selected={statename}
                    onSelect={(date) => functionName(date)} //when day is clicked
                    minDate={statename === blackoutEnd && blackoutStart}
                    maxDate={statename === blackoutStart && blackoutEnd}
                    //   onChange={this.handleChange} //only when value has changed
                />
            )
        }
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <div style={{ display: 'flex' }}>
                    <h3>Start</h3>
                    {renderDatePicker(blackoutStart, setBlackoutStart)}
                
                <h3>End</h3>
                    {renderDatePicker(blackoutEnd, setBlackoutEnd)}
                </div>
            </div>
        )
    }

    //const { loading, error, data:userIds, refetch, networkStatus } = useQuery(getAllUsersId)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( {JSON.stringify(error)}</p>
    if (networkStatus === 4) return <p>Refetching...</p>

    const sendAutoPopulatedShiftsToDB = () => {
        const formattedForDB = {}
        AutoPopulationSchedule.forEach((shift) => {
            const { id, ...rest } = shift
            let nextWeek
            const allShifts = []
            let currentWeek = 0
            const numberOfWeeks = 20
            while (currentWeek < numberOfWeeks) {
                nextWeek = { ...rest }
                nextWeek.start = new Date(shift.start)
                nextWeek.end = new Date(shift.end)
                nextWeek.start.setDate(
                    nextWeek.start.getDate() + currentWeek * 7
                )
                nextWeek.end.setDate(nextWeek.end.getDate() + currentWeek * 7)
                nextWeek.start = nextWeek.start.toISOString()
                nextWeek.end = nextWeek.end.toISOString()
                nextWeek.color = 'blue'
                allShifts.push(nextWeek)
                currentWeek++
            }
            if (id in formattedForDB) {
                formattedForDB[id].shifts = formattedForDB[id].shifts.concat(
                    allShifts
                )
            } else {
                formattedForDB[id] = {}
                formattedForDB[id]._id = id
                formattedForDB[id].shifts = [...allShifts]
            }
        })
        console.log(formattedForDB[`5e85411d6872e7001ec57743`])
        const myVar = Object.values(formattedForDB)
        //console.log(myVar)
        updateShifts({ variables: { users: myVar } })
    }

    // const sendAutoPopulatedShiftsToDB = () => {
    //     const formattedForDB = {}
    //     AutoPopulationSchedule.forEach((shift, index) => {
    //         if(shift.id === "5e85411d6872e7001ec57743")
    //         {
    //             console.log('STRING SHIFT', shift)
    //         }
    //         let nextWeek
    //         let weeks = []
    //         let i = 1
    //         while (i < 3)
    //         {
    //             nextWeek = {...shift}
    //             // let sStart = shift.start
    //             // let sEnd = shift.end
    //             nextWeek.start = new Date(shift.start)
    //             nextWeek.start.setDate(nextWeek.start.getDate()+i*7)
    //             nextWeek.end = new Date(shift.end)
    //             nextWeek.end.setDate(nextWeek.end.getDate()+i*7)
    //             // nextWeek.start.setDate(sStart.getDate()+(7))
    //             // nextWeek.end.setDate(sEnd.getDate()+(7))
    //             // if(nextWeek.id === "5e85411d6872e7001ec57743")
    //             // {
    //             //     console.log('Next Week', nextWeek)
    //             // }
    //             nextWeek.start = nextWeek.start.toISOString()
    //             nextWeek.end = nextWeek.end.toISOString()
    //             // if(nextWeek.id === "5e85411d6872e7001ec57743")
    //             // {
    //             //     console.log('Next Week2', nextWeek)
    //             // }
    //             nextWeek.color = 'blue'
    //             delete nextWeek.id
    //             weeks.push(nextWeek)
    //             //console.log(weeks)
    //             i++
    //         }
    //         //console.log('This is the added shifts going to the database', weeks)
    //         const { id, ...rest } = shift
    //         const myPushObj = {
    //             ...rest,
    //             start: rest.start.toISOString(),
    //             end: rest.end.toISOString(),

    //             // Change these two later
    //             //_id: id,
    //             color: 'blue',
    //         }
    //         // let test = []
    //         // test.push([myPushObj,...weeks])
    //         // console.log(myPushObj)
    //         // console.log('testtesttest', test)
    //         if (id in formattedForDB){ 
    //             // console.log('pushobj', myPushObj)
    //             // console.log('weeks', weeks)
    //             if(id === "5e85411d6872e7001ec57743") console.log('some string so we can see',[myPushObj,...weeks])
    //             formattedForDB[id].shifts.concat([myPushObj,...weeks])
    //         }
    //         else {
    //             if(id === "5e85411d6872e7001ec57743") console.log('got in the else', [myPushObj,...weeks])
    //             formattedForDB[id] = {}
    //             formattedForDB[id]._id = id
    //             formattedForDB[id].shifts = [myPushObj,...weeks]
    //         }
    //     })
    //     console.log(formattedForDB[`5e85411d6872e7001ec57743`])
    //     const myVar = Object.values(formattedForDB)
    //     //console.log(myVar)
    //     updateShifts({ variables: { users: myVar } })
    // }

    const sendBlackOutToDB = () => {
        console.log(blackoutStart, blackoutEnd)
        console.log(blackoutStart.toISOString(), blackoutEnd.toISOString())
        addBlackout({ variables: { start: blackoutStart.toISOString(), end: blackoutEnd.toISOString() } })
    }

    // AutoPopulationSchedule.sort(function (a, b) { return new Date(a.start) - new Date(b.start); })
    // console.log('Sorted AutoPop', AutoPopulationSchedule)

    //FOR EMPLOYEE
    // const handleDropShift = event => {
    //     const check = window.confirm(
    //         '\nDrop this shift: Ok - YES, Cancel - NO'
    //     )
    //     if (check) {
    //         let badDropAttempted = false
    //         if (
    //             event.start.getDate() >= blackoutStart.getDate() &&
    //             event.start.getDate() <= blackoutEnd.getDate() &&
    //             event.start.getMonth() == blackoutStart.getMonth() &&
    //                 event.start.getMonth() == blackoutEnd.getMonth() &&
    //             event.start.getFullYear() == blackoutStart.getFullYear() &&
    //                 event.start.getFullYear() == blackoutEnd.getFullYear()
    //         ) {
    //             badDropAttempted = true
    //         }

    //         if (!badDropAttempted) {
    //             let deleteSpot = myPreferencesList.indexOf(event)
    //             let tempArray = [...myPreferencesList]
    //             tempArray.splice(deleteSpot, 1)
    //             setMyPreferencesList(tempArray)
    //         }
    //         //Other shift drop stuff
    //     }
    // }

    // const reformatAutoPop = (arr) => {
    //     let newArr = []
    //     arr.forEach(({ assigned, shiftTime }) => {
    //         let newObj = { title: assigned.emp, start: new Date(2020, 2, 29, shiftTime, 0, 0), end: new Date(2020, 2, 29, shiftTime + 1, 0, 0) }
    //         newArr.push(newObj)
    //     })
    //     setAutoPopulationSchedule(newArr)
    // }

    return (
        <Card
            style={{
                width: '1500px',
            }}
        >
            <div>
            <TitleText style={{
                    textAlign: 'left',
                    position: 'flex',
                    fontSize: '48px',
                    //clear:'left'
                }}>Schedule</TitleText>
                <h3 style={{ color: colorPicked }}>
                    This is some schedule content
                </h3>
                <h3>First Name: {userData.getUserByID.firstName}</h3>
                <Swatch
                    onClick={() => setDisplayColorPicker(!displayColorPicker)}
                >
                    <Color color={colorPicked.hex} />
                    {displayColorPicker && (
                        <HuePicker
                            color={colorPicked}
                            onChange={handleColorChangeComplete}
                        />
                    )}
                </Swatch>
                {renderBlackout()}

                <div>
                    <PrimaryButton
                        style={{
                            //clear:'left',
                            align: 'left',
                        }}
                        onClick={(e) => sendBlackOutToDB()}
                    >
                        Submit Blackouts To Database
                    </PrimaryButton>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    ></div>
                </div>


                <DraggableCalendar
                    selectable
                    localizer={localizer}
                    events={myEventsList}
                    views={['month', 'week']}
                    defaultView={Views.WEEK}
                    defaultDate={new Date(2020, 1, 25)}
                    onSelectEvent={handleDelete}
                    onSelectSlot={handleSelect}
                    style={{ height: '80vh', width: '1450px' }}
                    dayPropGetter={handleBlackoutDate}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.color,
                            alignSelf: 'center',
                            alignContent: 'center',
                        },
                    })}
                    slotPropGetter={() => ({
                        style: {
                            // backgroundColor: 'red',
                            // borderColor: 'red'
                            border: 'none',
                            // display: 'flex',
                            alignItems: 'center',
                        },
                    })}
                    // titleAccessor={function(e) {
                    // 	console.log(e);
                    // 	return e.title;
                    // }}
                    components={{
                        event: Event,
                    }}
                    draggableAccessor={(event) => true}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                />

                {/* <AutoPopulate todo={(fromChild) => reformatAutoPop(fromChild)} /> */}
                <AutoPopulate
                    todo={(fromChild) => setAutoPopulationSchedule(fromChild)}
                />

                <div>
                    <PrimaryButton
                        style={{
                            //clear:'left',
                            align: 'left',
                        }}
                        onClick={(e) => sendAutoPopulatedShiftsToDB()}
                    >
                        Submit Shifts To Database
                    </PrimaryButton>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    ></div>
                </div>

                <DraggableCalendar
                    selectable
                    localizer={localizer}
                    events={AutoPopulationSchedule}
                    views={['month', 'week']}
                    defaultView={Views.WEEK}
                    defaultDate={new Date(2020, 2, 29)}
                    onSelectEvent={handleDelete}
                    onSelectSlot={handleSelect}
                    style={{ height: '80vh', width: '1450px' }}
                    dayPropGetter={handleBlackoutDate}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.color,
                            alignSelf: 'center',
                            alignContent: 'center',
                        },
                    })}
                    slotPropGetter={() => ({
                        style: {
                            // backgroundColor: 'red',
                            // borderColor: 'red'
                            border: 'none',
                            // display: 'flex',
                            alignItems: 'center',
                        },
                    })}
                    // titleAccessor={function(e) {
                    // 	console.log(e);
                    // 	return e.title;
                    // }}
                    components={{
                        event: Event,
                    }}
                    draggableAccessor={(event) => true}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                />
            </div>
        </Card>
    )
}