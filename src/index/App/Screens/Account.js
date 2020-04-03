import { useMutation, useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { UpdateUser } from '../API/Mutations/User'
import { GetUserByID } from '../API/Queries/User'
import '../Styles/Login.css'
import '../Styles/Schedule.css'
import {
    PrimaryButton,
    TextInput,
    SubtitleText,
    TitleText
} from './../Styles/StyledComponents'
import ProgressBar from 'react-bootstrap/ProgressBar'
moment.locale('en')
const localizer = momentLocalizer(moment)
const options = [
    { value: -100, label: 'In-Class', color: 'darkred' },
    { value: -1, label: 'Unpreferred', color: 'red' },
    { value: 0, label: 'Neutral', color: 'grey' },
    { value: 1, label: 'Preferred', color: 'green' }
]
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
let totalPreferredTime

export default function Account(props) {
    const [updatedEmail, updateEmail] = useState('')
    const [updatedFName, updateFName] = useState('')
    const [updatedLName, updateLName] = useState('')
    const [updatedDays, updateDays] = useState('')
    const [updatedSHour, updateSHour] = useState('')
    const [updatedEHour, updateEHour] = useState('')
    const [updatedSColor, updateSColor] = useState('')
    const [FirebaseID, ValidateFirebaseID] = useState('')
    const [myPreferencesList, setMyPreferencesList] = useState([])
    const [dropdownValue, setDropdownValue] = useState(options[1])
    const [copyFrom, setCopyFrom] = useState('Select')
    const [copyTo, setCopyTo] = useState('Select')

    const userID = '5e84ed25646154001efe8e85'

    const [update, mutationData] = useMutation(UpdateUser)
    const { loading, error, data, refetch, networkStatus } = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true
        }
    )

    const reFormatPreferenceList = prefArray => {
        let temp = []

        prefArray.forEach(({ title, start, end, color, value }) => {
            let startDate = new Date(start)
            let endDate = new Date(end)
            temp.push({ title, start: startDate, end: endDate, color, value })
        })
        setMyPreferencesList(temp)
    }
    useEffect(() => {
        const onCompleted = data => {
            reFormatPreferenceList(data.getUserByID.preferences)
        }
        if (onCompleted && !loading && !error) onCompleted(data)
    }, [loading, data, error])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( {JSON.stringify(error)}</p>
    if (networkStatus === 4) return <p>"Refetching!"</p>
    // if (data && oneTime) reFormatPreferenceList(data.getUserByID.preferences)

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
                {
                    title: dropdownValue.label,
                    start,
                    end,
                    color,
                    value: dropdownValue.value.toString()
                }
            ])
        }

        //Includes copying events to different locations
        const movePreference = ({ event, start, end }) => {
            let { title, color, value } = event

            const check = window.confirm(
                '\nCopy this event to new day?: Ok - YES, Cancel - NO'
            )
            if (check) {
                setMyPreferencesList([
                    ...myPreferencesList,
                    { title, start, end, color, value }
                ])
            } else {
                let tempArr = myPreferencesList.filter(item => item !== event)
                tempArr.push({ title, start, end, color, value })
                setMyPreferencesList(tempArr)
            }
        }

        const resizePreference = ({ event, start, end }) => {
            let index = myPreferencesList.indexOf(event)
            let { title, color, value } = event
            let tempArr = [...myPreferencesList]
            tempArr[index] = { title, color, start, end, value }
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

        const renderCopyPreference = () => {
            const handlePreferenceCopy = () => {
                let temp = [...myPreferencesList]
                let startingDate
                let endingDate
                //3,4,5,6
                if (copyTo.value > 2) {
                    startingDate = `April ${copyTo.value - 2}`
                    endingDate = `April ${copyTo.value - 2}`
                } else {
                    startingDate = `March ${29 + copyTo.value}`
                    endingDate = `March ${29 + copyTo.value}`
                }

                if (
                    copyFrom !== 'Select' ||
                    copyTo !== 'Select' ||
                    copyTo.value !== copyFrom.value
                ) {
                    myPreferencesList.forEach(
                        ({ start, title, end, color, value }) => {
                            if (start.getDay() === copyFrom.value) {
                                let newStart = new Date(
                                    `${startingDate}, 2020 ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
                                )
                                let newEnd = new Date(
                                    `${endingDate}, 2020 ${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
                                )
                                temp.push({
                                    title: title,
                                    start: newStart,
                                    end: newEnd,
                                    color: color,
                                    value: value
                                })
                            }
                        }
                    )
                }
                setMyPreferencesList(temp)
            }
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <TitleText>Preferences</TitleText>
                    {/* <PrimaryButton onClick={() => console.log(myPreferencesList)}>
                        log state
                    </PrimaryButton> */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: '80%'
                        }}
                    >
                        <Dropdown
                            options={options}
                            onChange={x => setDropdownValue(x)}
                            value={dropdownValue}
                            placeholder='Select an option'
                        />

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SubtitleText>From</SubtitleText>
                            <Dropdown
                                options={DAYS}
                                onChange={x => setCopyFrom(x)}
                                value={copyFrom}
                                placeholder='Select an option'
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SubtitleText>To</SubtitleText>
                            <Dropdown
                                options={DAYS}
                                onChange={x => setCopyTo(x)}
                                value={copyTo}
                                placeholder='Select an option'
                            />
                        </div>
                    </div>

                    <PrimaryButton onClick={() => handlePreferenceCopy()}>
                        Copy
                    </PrimaryButton>
                </div>
            )
        }
        const getTotalPreferredHours = () => {
            totalPreferredTime = 0
            myPreferencesList.forEach(({ value, start, end }) => {
                if (value === '1') {
                    let startDate = new Date(start)
                    let endDate = new Date(end)
                    let timeDifference =
                        endDate.getHours() +
                        endDate.getMinutes() / 60 -
                        (startDate.getHours() + startDate.getMinutes() / 60)
                    totalPreferredTime += timeDifference
                }
            })
            return totalPreferredTime
        }
        return (
            <div>
                {renderCopyPreference()}
                <PrimaryButton
                    onClick={e =>
                        totalPreferredTime >= 30 &&
                        update({
                            variables: {
                                id: userID,
                                preferences: myPreferencesList
                            }
                        })
                    }
                >
                    Submit To Database
                </PrimaryButton>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <h1>{getTotalPreferredHours()}</h1>
                    <ProgressBar
                        style={{ width: '50%' }}
                        animated
                        now={(getTotalPreferredHours() / 3) * 10}
                    />
                </div>
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

    return (
        <div>
            <h1>Account</h1>
            <h1>{data.getUserByID.firstName}</h1>
            <h3>
                Here you can update your account information. Please provide
                your FirebaseID in the box below before submitting any changes
            </h3>

            <button onClick={() => refetch()}>Click me!</button>

            <h4>Provide your FirebaseID here</h4>
            <TextInput
                placeholder='FirebaseID'
                type='text'
                value={FirebaseID}
                onChange={e => ValidateFirebaseID(e.target.value)}
            />

            <h4>Update your email here</h4>
            <TextInput
                placeholder='Email'
                type='text'
                value={updatedEmail}
                onChange={e => updateEmail(e.target.value)}
            />
            <PrimaryButton
                onClick={e =>
                    update({
                        variables: {
                            id: userID,
                            email: updatedEmail
                        }
                    })
                }
            >
                Update Email
            </PrimaryButton>

            <h4>Update your First and Last Name here</h4>
            <TextInput
                placeholder='First Name'
                type='text'
                value={updatedFName}
                onChange={e => updateFName(e.target.value)}
            />
            <PrimaryButton
                onClick={e =>
                    update({
                        variables: {
                            id: userID,
                            first: updatedFName
                        }
                    })
                }
            >
                Update First Name
            </PrimaryButton>
            <TextInput
                placeholder='Last Name'
                type='text'
                value={updatedLName}
                onChange={e => updateLName(e.target.value)}
            />
            <PrimaryButton
                onClick={e =>
                    update({
                        variables: {
                            id: userID,
                            last: updatedLName
                        }
                    })
                }
            >
                Update Last Name
            </PrimaryButton>

            <h4>Update your shift preferences here</h4>
            <TextInput
                placeholder='Days'
                type='text'
                value={updatedDays}
                onChange={e => updateDays(e.target.value)}
            />
            <TextInput
                placeholder='Starting Hour'
                type='text'
                value={updatedSHour}
                onChange={e => updateSHour(e.target.value)}
            />

            <TextInput
                placeholder='Ending Hour'
                type='text'
                value={updatedEHour}
                onChange={e => updateEHour(e.target.value)}
            />
            <TextInput
                placeholder='Color on calendar'
                type='text'
                value={updatedSColor}
                onChange={e => updateSColor(e.target.value)}
            />
            <PrimaryButton
                onClick={e =>
                    update({
                        variables: {
                            id: userID,
                            preferences: [
                                {
                                    title: updatedDays,
                                    start: updatedSHour,
                                    end: updatedEHour,
                                    color: updatedSColor
                                }
                            ]
                        }
                    })
                }
            >
                Update Hour Preferences
            </PrimaryButton>

            <PrimaryButton>GA Clock-in</PrimaryButton>
            {renderPreferenceSchedule()}
        </div>
    )
}
