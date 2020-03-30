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
import { MdDirectionsWalk } from 'react-icons/md'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { useQuery } from '@apollo/react-hooks'
import { GetUserByID } from './../API/Queries/User'
moment.locale('en')
const options = [
    { value: -100, label: 'In-Class', color: 'darkred' },
    { value: -1, label: 'Unpreferred', color: 'red' },
    { value: 0, label: 'Neutral', color: 'grey' },
    { value: 1, label: 'Preferred', color: 'green' }
]
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

const DAYS = [
    {
        value: 0,
        label: 'Sunday'
    },
    {
        value: 1,
        label: 'Monday'
    },
    {
        value: 2,
        label: 'Tuesday'
    },
    {
        value: 3,
        label: 'Wednesday'
    },
    {
        value: 4,
        label: 'Thursday'
    },
    {
        value: 5,
        label: 'Friday'
    },
    {
        value: 6,
        label: 'Saturday'
    }
]

export default function Schedule(props) {
    const [myEventsList, setMyEventsList] = useState([])
    const [myPreferencesList, setMyPreferencesList] = useState([])
    const [colorPicked, setColorPicked] = useState('red')
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [blackoutStart, setBlackoutStart] = useState('')
    const [blackoutEnd, setBlackoutEnd] = useState('')
    const [dropdownValue, setDropdownValue] = useState(options[1])
    const [copyFrom, setCopyFrom] = useState('Select')
    const [copyTo, setCopyTo] = useState('Select')

    var blackOutYear = [2020, 2020]
    var blackOutMonth = [1, 1]
    var blackOutDay = [27, 28]

    //useEffect => what to do after the component is rendered
    useEffect(() => {
        //calling setMyEventsList to set hardcoded list
        setMyEventsList([
            {
                title: 'Employee 1',
                start: new Date(2020, 1, 23, 5),
                end: new Date(2020, 1, 23, 18),
                color: '#fc0373'
            },
            {
                title: 'Employee 3',
                start: new Date(2020, 1, 25, 10),
                end: new Date(2020, 1, 25, 16),
                color: '#18fc03'
            }
        ])
    }, [])

    const handleSelect = ({ start, end }) => {
        console.log(myEventsList)

        const title = window.prompt('New Event name')
        if (title) {
            //Adjusted portion for blackout days
            var x
            var count = 0
            for (x in blackOutYear) {
                if (
                    start.getFullYear() === blackOutYear[x] &&
                    start.getMonth() === blackOutMonth[x] &&
                    start.getDate() === blackOutDay[x] &&
                    end.getFullYear() === blackOutYear[x] &&
                        end.getMonth() === blackOutMonth[x] &&
                        end.getDate() === blackOutDay[x]
                ) {
                    count++
                }
            }

            if (count === 0) {
                setMyEventsList([
                    ...myEventsList,
                    { title, start, end, color: colorPicked && colorPicked.hex }
                ])
            } else {
                alert('Event not able to be set during this time.')
            }
        }
    }

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

        Date.prototype.addDays = function(days) {
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
                <p>{blackoutStart && typeof blackoutStart}</p>
            </div>
        )
    }

    //Auto Population Progress
    // const handleAutoPopulation = () => {

    // 	//Events should hopefully also have employee names, tenure, and potentially other preference info attached somehow, either in the title of the preference, or something else
    // 	myPreferencesList.forEach((x) => {
    // 		if(x.title == "Preferred" || x.title == "Unpreferred" || x.title == "Neutral")
    // 		{
    // 			setMyEventsList([...myEventsList, { title: x.title, start: x.start, end: x.end, color: x.color }]);
    // 		}
    // 	})

    // }

    //Employee Preference Calendar Functions

    const renderPreferenceSchedule = () => {
        let formats = {
            dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture)
        }
        const handleSelectPreference = ({ start, end }) => {
            let color = 'green'

            if (dropdownValue.value == -1) color = 'red'
            else if (dropdownValue.value == 0) color = 'grey'
            else if (dropdownValue.value == -100) color = 'darkred'

            setMyPreferencesList([
                ...myPreferencesList,
                { title: dropdownValue.label, start, end, color }
            ])
        }

        //Includes copying events to different locations
        const movePreference = ({ event, start, end }) => {
            let { title, color } = event

            const check = window.confirm(
                '\nCopy this event to new day?: Ok - YES, Cancel - NO'
            )
            if (check) {
                setMyPreferencesList([
                    ...myPreferencesList,
                    { title, start, end, color }
                ])
            } else {
                let tempArr = myPreferencesList.filter(item => item !== event)
                tempArr.push({ title, start, end, color })
                setMyPreferencesList(tempArr)
            }
        }

        const resizePreference = ({ event, start, end }) => {
            let index = myPreferencesList.indexOf(event)
            let { title, color } = event
            let tempArr = [...myPreferencesList]
            tempArr[index] = { title, color, start, end }
            setMyPreferencesList(tempArr)
        }

        const handleDeletePreference = event => {
            const check = window.confirm(
                '\nDelete this event: Ok - YES, Cancel - NO'
            )
            if (check) {
                let deleteSpot = myPreferencesList.indexOf(event)
                let tempArray = [...myPreferencesList]
                tempArray.splice(deleteSpot, 1)
                setMyPreferencesList(tempArray)
            }
        }

        //Employee Calendar Functions
        const handleDropShift = event => {
            const check = window.confirm(
                '\nDrop this shift: Ok - YES, Cancel - NO'
            )
            if (check) {
                let badDropAttempted = false
                if (
                    event.start.getDate() >= blackoutStart.getDate() &&
                    event.start.getDate() <= blackoutEnd.getDate() &&
                    event.start.getMonth() == blackoutStart.getMonth() &&
                        event.start.getMonth() == blackoutEnd.getMonth() &&
                    event.start.getFullYear() == blackoutStart.getFullYear() &&
                        event.start.getFullYear() == blackoutEnd.getFullYear()
                ) {
                    badDropAttempted = true
                }

                if (!badDropAttempted) {
                    let deleteSpot = myPreferencesList.indexOf(event)
                    let tempArray = [...myPreferencesList]
                    tempArray.splice(deleteSpot, 1)
                    setMyPreferencesList(tempArray)
                }
                //Other shift drop stuff
            }
        }
        const renderCopyPreference = () => {
            const handlePreferenceCopy = () => {
                let temp = [...myPreferencesList]
                if (
                    copyFrom !== 'Select' ||
                    copyTo !== 'Select' ||
                    copyTo.value === copyFrom.value
                ) {
                    myPreferencesList.forEach(
                        ({ start, title, end, color }) => {
                            if (start.getDay() === copyFrom.value) {
                                let newStart = new Date(
                                    `March ${29 +
                                        copyTo.value}, 2020 ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
                                )
                                let newEnd = new Date(
                                    `March ${29 +
                                        copyTo.value}, 2020 ${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
                                )
                                temp.push({
                                    title: title,
                                    start: newStart,
                                    end: newEnd,
                                    color: color
                                })
                            }
                        }
                    )
                    setMyPreferencesList(temp)
                }
            }
            return (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p>From</p>
                        <Dropdown
                            options={DAYS}
                            onChange={x => setCopyFrom(x)}
                            value={copyFrom}
                            placeholder='Select an option'
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p>To</p>
                        <Dropdown
                            options={DAYS}
                            onChange={x => setCopyTo(x)}
                            value={copyTo}
                            placeholder='Select an option'
                        />
                    </div>
                    <PrimaryButton onClick={() => handlePreferenceCopy()}>
                        Copy
                    </PrimaryButton>
                    <p>{myPreferencesList.length}</p>
                </div>
            )
        }
        return (
            <div>
                {renderCopyPreference()}
                <DraggableCalendar //Preferences calendar
                    selectable
                    localizer={localizer}
                    toolbar={false}
                    formats={formats}
                    events={myPreferencesList}
                    view={Views.WEEK}
                    defaultDate={new Date(2020, 2, 29)}
                    onSelectEvent={handleDeletePreference}
                    onSelectSlot={handleSelectPreference}
                    style={{ height: '80vh', width: '80vw', margin: '10vw' }}
                    eventPropGetter={event => ({
                        style: {
                            backgroundColor: event.color,
                            alignSelf: 'center',
                            alignContent: 'center'
                        }
                    })}
                    slotPropGetter={() => ({
                        //left pane, time
                        style: {
                            border: 'none',
                            alignItems: 'center'
                        }
                    })}
                    dayPropGetter={() => ({
                        style: {
                            alignItems: 'flex-start'
                        }
                    })}
                    // titleAccessor={function(e) {
                    // 	console.log(e);
                    // 	return e.title;
                    // }}
                    // components={{
                    // 	event: Event
                    // }}
                    draggableAccessor={event => true}
                    onEventDrop={movePreference}
                    onEventResize={resizePreference}
                />
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

            <p>Preferences</p>

            <Dropdown
                options={options}
                onChange={x => setDropdownValue(x)}
                value={dropdownValue}
                placeholder='Select an option'
            />

            {renderPreferenceSchedule()}
        </div>
    )
}
