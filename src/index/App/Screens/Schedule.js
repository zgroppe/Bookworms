import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import {
    Card,
    Hyperlink,
    PrimaryButton,
    SubtitleText,
    TextInput,
    TitleText
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
import { useQuery } from '@apollo/react-hooks'
import { GetUserByID } from './../API/Queries/User'
import AutoPopulate from './../Functions/AutoPopulation'

moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

export default function Schedule(props) {
    const [myEventsList, setMyEventsList] = useState([])
    const [colorPicked, setColorPicked] = useState('red')
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [blackoutStart, setBlackoutStart] = useState('')
    const [blackoutEnd, setBlackoutEnd] = useState('')


    //useEffect => what to do after the component is rendered
    useEffect(() => {
        //calling setMyEventsList to set hardcoded list
        setMyEventsList([
            { title: 'Employee 1', start: new Date(2020, 1, 23, 5), end: new Date(2020, 1, 23, 18), color: '#fc0373' },
            { title: 'Employee 3', start: new Date(2020, 1, 25, 10), end: new Date(2020, 1, 25, 16), color: '#18fc03' }
        ]);
    }, []);

    const handleSelect = ({ start, end }) => {
        const title = window.prompt('New Event name');
        if (title) setMyEventsList([...myEventsList, { title, start, end, color: colorPicked && colorPicked.hex }]);
    };

    const handleColorChangeComplete = (color, event) =>
        setColorPicked(color, () => setDisplayColorPicker(!displayColorPicker))

    const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

    const moveEvent = ({ event, start, end }) => {
        let { title, color } = event
        let tempArr = myEventsList.filter(item => item !== event)
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

    const handleDelete = event => {
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
    const handleBlackoutDate = date => {
        let blackoutStartDate = new Date(blackoutStart)
        let blackoutStartDate2 = new Date(blackoutEnd)

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
                        backgroundColor: '#000'
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
                    onSelect={date => functionName(date)} //when day is clicked
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
                    justifyContent: 'center'
                }}
            >
                <div style={{ display: 'flex' }}>
                    <p>start</p>
                    {renderDatePicker(blackoutStart, setBlackoutStart)}
                </div>
                <div style={{ display: 'flex' }}>
                    <p>end</p>
                    {renderDatePicker(blackoutEnd, setBlackoutEnd)}
                </div>
            </div>
        )
    }

    const { loading, error, data: userData, refetch, networkStatus } = useQuery(
        GetUserByID,
        {
            variables: { id: '5e795c57a7e84353d4d1d47b' },
            notifyOnNetworkStatusChange: true
        }
    )
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( {JSON.stringify(error)}</p>
    if (networkStatus === 4) return <p>Refetching...</p>

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

    return (
        <div>
            <h1>Schedule</h1>
            <h3 style={{ color: colorPicked }}>
                This is some schedule content
            </h3>
            <h3>First: {userData.getUserByID.firstName}</h3>
            <Swatch onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                <Color color={colorPicked.hex} />
                {displayColorPicker && (
                    <HuePicker
                        color={colorPicked}
                        onChange={handleColorChangeComplete}
                    />
                )}
            </Swatch>
            {renderBlackout()}

            <DraggableCalendar
                selectable
                localizer={localizer}
                events={myEventsList}
                views={['month', 'week']}
                defaultView={Views.WEEK}
                defaultDate={new Date(2020, 1, 25)}
                onSelectEvent={handleDelete}
                onSelectSlot={handleSelect}
                style={{ height: '80vh', width: '80vw', margin: '10vw' }}
                dayPropGetter={handleBlackoutDate}
                eventPropGetter={event => ({
                    style: {
                        backgroundColor: event.color,
                        alignSelf: 'center',
                        alignContent: 'center'
                    }
                })}
                slotPropGetter={() => ({
                    style: {
                        // backgroundColor: 'red',
                        // borderColor: 'red'
                        border: 'none',
                        // display: 'flex',
                        alignItems: 'center'
                    }
                })}
                // titleAccessor={function(e) {
                // 	console.log(e);
                // 	return e.title;
                // }}
                components={{
                    event: Event
                }}
                draggableAccessor={event => true}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
            />

            <PrimaryButton onClick={() => AutoPopulate}>
                        Auto Populate
            </PrimaryButton>

            <DraggableCalendar
                selectable
                localizer={localizer}
                events={[]}
                views={['month', 'week']}
                defaultView={Views.WEEK}
                defaultDate={new Date(2020, 1, 25)}
                onSelectEvent={handleDelete}
                onSelectSlot={handleSelect}
                style={{ height: '80vh', width: '80vw', margin: '10vw' }}
                dayPropGetter={handleBlackoutDate}
                eventPropGetter={event => ({
                    style: {
                        backgroundColor: event.color,
                        alignSelf: 'center',
                        alignContent: 'center'
                    }
                })}
                slotPropGetter={() => ({
                    style: {
                        // backgroundColor: 'red',
                        // borderColor: 'red'
                        border: 'none',
                        // display: 'flex',
                        alignItems: 'center'
                    }
                })}
                // titleAccessor={function(e) {
                // 	console.log(e);
                // 	return e.title;
                // }}
                components={{
                    event: Event
                }}
                draggableAccessor={event => true}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
            />

        </div>
    )
}
