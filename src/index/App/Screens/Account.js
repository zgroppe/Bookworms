import { useMutation, useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useEffect, useState, useContext } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { UpdateUser } from '../API/Mutations/User'
import '../Styles/Login.css'
import '../Styles/Schedule.css'
import { AuthContext } from './../Components/Auth'
import {
    Card,
    PrimaryButton,
    SubtitleText,
    TextInput,
    TitleText,
} from './../Styles/StyledComponents'
moment.locale('en')
const localizer = momentLocalizer(moment)
const options = [
    { value: -100, label: 'In-Class', color: 'darkred' },
    { value: -1, label: 'Unpreferred', color: 'red' },
    { value: 0, label: 'Neutral', color: 'grey' },
    { value: 1, label: 'Preferred', color: 'green' },
]

const DraggableCalendar = withDragAndDrop(Calendar)
const DAYS = [
    {
        value: 0,
        label: 'Sunday',
    },
    {
        value: 1,
        label: 'Monday',
    },
    {
        value: 2,
        label: 'Tuesday',
    },
    {
        value: 3,
        label: 'Wednesday',
    },
    {
        value: 4,
        label: 'Thursday',
    },
    {
        value: 5,
        label: 'Friday',
    },
    {
        value: 6,
        label: 'Saturday',
    },
]
let totalPreferredTime

export default function Account(props) {
    const { user, setUser } = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState(user)
    const [myPreferencesList, setMyPreferencesList] = useState([])
    const [dropdownValue, setDropdownValue] = useState(options[1])
    const [copyFrom, setCopyFrom] = useState('Select')
    const [copyTo, setCopyTo] = useState('Select')

    const [update, { data, loading }] = useMutation(UpdateUser)

    const reFormatPreferenceList = (prefArray) => {
        let temp = []
        prefArray.forEach(({ title, start, end, color, value }) => {
            let startDate = new Date(start)
            let endDate = new Date(end)
            temp.push({ title, start: startDate, end: endDate, color, value })
        })
        temp.sort(function (a, b) {
            return new Date(a.start) - new Date(b.start)
        })
        setMyPreferencesList(temp)
    }

    useEffect(() => {
        reFormatPreferenceList(user.preferences)
    }, [user])

    useEffect(() => {
        if (!loading && data && data.updateUser) {
            debugger
            setUser(data.updateUser)
        }
    }, [data, loading, setUser])

    const renderPreferenceSchedule = () => {
        let formats = {
            dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture),
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
                    value: dropdownValue.value.toString(),
                },
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
                    { title, start, end, color, value },
                ])
            } else {
                let tempArr = myPreferencesList.filter((item) => item !== event)
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

        const handleDeletePreference = (event) => {
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
                                    value: value,
                                })
                            }
                        }
                    )
                }
                setMyPreferencesList(temp)
            }
            return (
                <div>
                    <TitleText
                        style={{
                            fontSize: '3rem',
                            textAlign: 'left',
                        }}
                    >
                        Preferences
                    </TitleText>
                    <PrimaryButton
                        style={{
                            align: 'left',
                        }}
                        onClick={() => console.log(myPreferencesList)}
                    >
                        Log State
                    </PrimaryButton>
                    <PrimaryButton
                        style={{
                            align: 'left',
                        }}
                        onClick={() => handlePreferenceCopy()}
                    >
                        Copy
                    </PrimaryButton>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                        }}
                    >
                        <Dropdown
                            options={options}
                            onChange={(x) => setDropdownValue(x)}
                            value={dropdownValue}
                            placeholder='Select an option'
                        />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SubtitleText>From</SubtitleText>
                            <Dropdown
                                options={DAYS}
                                onChange={(x) => setCopyFrom(x)}
                                value={copyFrom}
                                placeholder='Select an option'
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SubtitleText>To</SubtitleText>
                            <Dropdown
                                options={DAYS}
                                onChange={(x) => setCopyTo(x)}
                                value={copyTo}
                                placeholder='Select an option'
                            />
                        </div>
                    </div>
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
                    style={{
                        //clear:'left',
                        align: 'left',
                    }}
                    onClick={(e) =>
                        totalPreferredTime >= 30 &&
                        update({
                            variables: {
                                id: user._id,
                                preferences: myPreferencesList.sort(function (
                                    a,
                                    b
                                ) {
                                    return new Date(a.start) - new Date(b.start)
                                }),
                            },
                        })
                    }
                >
                    Submit To Database
                </PrimaryButton>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                ></div>

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
                    style={{ align: 'center', width: '100%' }}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.color,
                            alignSelf: 'center',
                            alignContent: 'center',
                        },
                    })}
                    slotPropGetter={() => ({
                        //left pane, time
                        style: {
                            border: 'none',
                            alignItems: 'center',
                        },
                    })}
                    dayPropGetter={() => ({
                        style: {
                            alignItems: 'flex-start',
                        },
                    })}
                    draggableAccessor={(event) => true}
                    onEventDrop={movePreference}
                    onEventResize={resizePreference}
                />
            </div>
        )
    }
    const renderRow = (state, placeholder) => {
        const onChange = (value) => {
            let temp = { ...userInfo }
            temp[state] = value
            setUserInfo(temp)
        }
        return (
            <TextInput
                placeholder={placeholder}
                type='text'
                value={userInfo[state]}
                borderColor={userInfo[state] === '' && 'red'}
                onChange={(e) => onChange(e.target.value)}
            />
        )
    }
    const validation = ({ email, firstName, lastName }) => {
        if (email === '' || firstName === '' || lastName === '')
            console.log('asad')
        else {
            update({
                variables: {
                    id: user._id,
                    first: firstName,
                    last: lastName,
                    email: email,
                },
            })
        }
    }
    return (
        <Card
            style={{
                width: '78vw',
            }}
        >
            <div>
                <TitleText
                    style={{
                        textAlign: 'left',
                        position: 'flex',
                        fontSize: '3rem',
                    }}
                >
                    Account Information
                </TitleText>
                {/* <h1
                    style={{
                        textAlign: 'left',
                    }}
                >
                    {user.firstName}
                </h1> */}
                <h3
                    style={{
                        textAlign: 'start',
                        fontSize: '1.3rem',
                    }}
                >
                    Here you can update your account information.
                </h3>
                {/* {renderRow('email', 'Email')} */}
                {renderRow('firstName', 'First Name')}
                {renderRow('lastName', 'Last Name')}
                <PrimaryButton
                    style={{
                        display: 'block',
                    }}
                    onClick={() => validation(userInfo)}
                >
                    Save
                </PrimaryButton>
                {renderPreferenceSchedule()}
            </div>
        </Card>
    )
}
