import { useMutation, useQuery } from '@apollo/react-hooks'
import React, { useContext, useEffect, useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { UpdateUsersShifts } from '../API/Mutations/Shifts'
import '../Styles/Schedule.css'
import { CreateBlackout } from './../API/Mutations/Blackout'
import { GetBlackouts } from './../API/Queries/Blackout'
import { GetAllUsersId, GetUserByID } from './../API/Queries/User'
import { AuthContext } from './../Components/Auth'
import AutoPopulate from './../Functions/AutoPopulation'
import { Card, PrimaryButton, TitleText, SubtitleText } from './../Styles/StyledComponents'
import Form from 'react-bootstrap/Form'
import MyCalendar from './../Components/Calendar'

export default function Schedule(props) {
    //State variables
    const [myEventsList, setMyEventsList] = useState([])
    const [colorPicked, setColorPicked] = useState('red')
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [blackoutStart, setBlackoutStart] = useState('')
    const [blackoutEnd, setBlackoutEnd] = useState('')
    const [AutoPopulationSchedule, setAutoPopulationSchedule] = useState([])
    const [blackoutDates, setBlackoutDates] = useState([])
    const [weeklyMax, setWeeklyMax] = useState(null)
    const [dailyMax, setDailyMax] = useState(null)

    //Context var to allow for ease in access to current user info
    const { user } = useContext(AuthContext)

    //Database mutation declarations, for the create blackout and update user shifts mutations
    const [addBlackout] = useMutation(CreateBlackout)
    const [updateShifts] = useMutation(UpdateUsersShifts)

    //Database query declaration for the get user by ID query
    const { loading, error, data: userData, refetch, networkStatus } = useQuery(
        GetUserByID,
        {
            variables: { id: user._id },
            notifyOnNetworkStatusChange: true,
        }
    )

    //Database query declaration for the get all users by ID query
    const {
        loading: loading2,
        error: error2,
        data: multipleUserData,
        refetch: refetch2,
        networkStatus: netStat2,
    } = useQuery(GetAllUsersId)

    //Database query declaration for the get all blackouts query
    const {
        loading: loading3,
        error: error3,
        data: data3,
        refetch: refetch3,
        networkStatus: netStat3,
    } = useQuery(GetBlackouts)

    //useEffect => what to do after the components are rendered
    useEffect(() => {
        //Setup example setMyEventsList list
        setMyEventsList([
            {
                title: 'EXAMPLE Employee 1',
                start: new Date(2020, 1, 23, 5),
                end: new Date(2020, 1, 23, 18),
                color: '#fc0373',
            },
            {
                title: 'EXAMPLE Employee 3',
                start: new Date(2020, 1, 25, 10),
                end: new Date(2020, 1, 25, 16),
                color: '#18fc03',
            },
        ])

        //On completed function, essentially checking for that of the correct loading of the blackout dates into the file
        const onCompleted = (data3) => {
            let temp = []
            //console.log('GOT HERE')
            data3.getBlackouts.forEach(({ start, end }) => {
                let startDate = new Date(start)
                let endDate = new Date(end)
                //console.log(startDate, '\n', endDate)
                temp.push({ start: startDate, end: endDate })
                //console.log(temp)
            })
            //console.log(temp)
            setBlackoutDates(temp)
            //console.log(blackoutDates)
        }

        //Call for onComplete function given certain data
        if (!loading3 && !error3) onCompleted(data3)
    }, [loading3, data3, error3])

    //Calendar function that handles that of the creation of new calendar events
    const handleSelect = ({ start, end }) => {
        const title = window.prompt('New Event name')
        if (title)
            setMyEventsList([
                ...myEventsList,
                { title, start, end, color: colorPicked && colorPicked.hex },
            ])
    }

    //Handles color changes using our color changer (MAY DELETE)
    const handleColorChangeComplete = (color, event) =>
        setColorPicked(color, () => setDisplayColorPicker(!displayColorPicker))

    //Establishes base event
    const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

    //Calendar function that handles the movement of calendar events
    const moveEvent = ({ event, start, end }) => {
        let { title, color } = event
        let tempArr = myEventsList.filter((item) => item !== event)
        tempArr.push({ title, start, end, color })
        setMyEventsList(tempArr)
    }

    //Calendar function that handles the resizing of calendar events
    const resizeEvent = ({ event, start, end }) => {
        let index = myEventsList.indexOf(event)
        let { title, color } = event
        let tempArr = [...myEventsList]
        tempArr[index] = { title, color, start, end }
        setMyEventsList(tempArr)
    }

    //Calendar function that handles the deletion of calendar events
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
        //Loop going through all potential blackout dates
        for (let i in blackoutDates) {
            //Gets our start and end of any particular blackout range
            let blackoutStartDate = blackoutDates[i].start
            let blackoutStartDate2 = blackoutDates[i].end

            //Function adding day object time
            Date.prototype.addDays = function (days) {
                var date = new Date(this.valueOf())
                date.setDate(date.getDate() + days)
                return date
            }

            //Function finding all the days inbetween the beginning and end of the stated blackout range
            function getDates(startDate, stopDate) {
                var dateArray = new Array()
                var currentDate = startDate
                while (currentDate <= stopDate) {
                    dateArray.push(new Date(currentDate))
                    currentDate = currentDate.addDays(1)
                }
                return dateArray
            }

            //Array containing all the blackout days in a given blackout range
            let arr = getDates(blackoutStartDate, blackoutStartDate2)

            //Function going through all of the blackout days in a given range and making the their cells in the calendar
            //blacked out
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

    //Handles the rendering of any given blackout
    const renderBlackout = () => {
        //Function rendering our chosen date picker, and then using said dates for blackout day selection
        const renderDatePicker = (statename, functionName) => {
            return (
                <DatePicker
                    selected={statename}
                    onSelect={(date) => functionName(date)}
                    minDate={statename === blackoutEnd && blackoutStart}
                    maxDate={statename === blackoutStart && blackoutEnd}
                />
            )
        }
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <div style={{ display: 'flex',justifyContent: 'center' }}>
                    <h4>Blackout Start <br /> {renderDatePicker(blackoutStart, setBlackoutStart)}</h4>
                    
                    
                    <h4>Blackout End <br /> {renderDatePicker(blackoutEnd, setBlackoutEnd)}</h4>
                    
                </div>
            </div>
        )
    }

    //Database checking things
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( {JSON.stringify(error)}</p>
    if (networkStatus === 4) return <p>Refetching...</p>

    //Function handling the sending of shifts to the database
    const sendAutoPopulatedShiftsToDB = () => {
        const formattedForDB = {}

        //Loop going through all auto populated shifts
        AutoPopulationSchedule.forEach((shift) => {
            const { id, ...rest } = shift
            let nextWeek
            const allShifts = []
            let currentWeek = 0
            const numberOfWeeks = 50

            //This loop goes through, and adds additional shifts based off of our 20 week work period
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

            //This if else statement goes in and formats auto populated and added shifts for sending to the database
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

        //This takes in all shifts formatted for the database
        const myVar = Object.values(formattedForDB)

        //This sends all shifts to the database in one go
        updateShifts({ variables: { users: myVar } })
    }

    //Function handling the sending of selected blackout date range to the database
    const sendBlackOutToDB = () => {
        //Sends current blackout range to the database
        addBlackout({
            variables: {
                start: blackoutStart.toISOString(),
                end: blackoutEnd.toISOString(),
            },
        })
    }

    //Handles the rendering and actions of the adjust weekly and daily max hours local storage vars
    const renderHoursButton = () => {
        //Function ensuring the safe adjustment of our targeted variables
        const validation = () => {
            if (weeklyMax !== 0 && dailyMax !== 0) {
                localStorage.setItem('currentWeeklyMax', weeklyMax)
                localStorage.setItem('currentDailyMax', dailyMax)
            }
            setWeeklyMax(null)
            setDailyMax(null)
        }
        return (
            <PrimaryButton onClick={() => validation()}>
                Adjust Hour Maxes
            </PrimaryButton>
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
                    fontSize: '48px',
                    //clear:'left'
                }}>Schedule</TitleText>
                <SubtitleText> View both the Blackout Calendar and Create Auto-Populated Calendars. </SubtitleText>
                <br />
                <br />
                <h3>Blackout Calendar</h3>
                <SubtitleText> Here you may set new Blackout dates to the Calendar.</SubtitleText>
                <br />
                <br />
                {/* <Swatch
                    onClick={() => setDisplayColorPicker(!displayColorPicker)}
                >
                    <Color color={colorPicked.hex} />
                    {displayColorPicker && (
                        <HuePicker
                            color={colorPicked}
                            onChange={handleColorChangeComplete}
                        />
                    )}
                </Swatch> */}
                {renderBlackout()}

                <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                    <PrimaryButton
                        style={{
                            align: 'left',
                        }}
                        onClick={(e) => sendBlackOutToDB()}
                    >
                        Submit Blackouts To Database
                    </PrimaryButton>
                </div>

                <MyCalendar
                    events={myEventsList}
                    dayPropGetter={handleBlackoutDate}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.color,
                            alignSelf: 'center',
                            alignContent: 'center',
                        },
                    })}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                />

                {/* <AutoPopulate todo={(fromChild) => reformatAutoPop(fromChild)} /> */}
                <br />
                <br />
                <h3>Auto Population Calendar</h3>
                <SubtitleText>Generate new work Calendars with the Auto Population feature.</SubtitleText>
                <br />
                <br />
                <h2>Hours</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Weekly Max</Form.Label>
                        <Form.Control type='text' placeholder='Weekly Max' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Daily Max</Form.Label>
                        <Form.Control type='text' placeholder='Daily Max' />
                    </Form.Group>
                    {renderHoursButton()}
                </Form>

                <AutoPopulate
                    todo={(fromChild) => setAutoPopulationSchedule(fromChild)}
                />

                
                    <PrimaryButton
                        style={{
                            align: 'left',
                        }}
                        onClick={(e) => sendAutoPopulatedShiftsToDB()}
                    >
                        Submit Shifts To Database
                    </PrimaryButton>
                </div>

                <MyCalendar
                    events={AutoPopulationSchedule}
                    onSelectEvent={handleDelete}
                    onSelectSlot={handleSelect}
                    dayPropGetter={handleBlackoutDate}
                    draggableAccessor={(event) => true}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                />
        </Card>
    )
}
