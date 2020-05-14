// Importation of modules, APIs, etc.
import { useMutation } from '@apollo/react-hooks'
import React, { useEffect, useState, useContext } from 'react'
import { Views } from 'react-big-calendar'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { UpdateUser } from '../API/Mutations/User'
import '../Styles/Login.css'
import '../Styles/Schedule.css'
import { AuthContext } from './../Components/Auth'

import MyCalendar from './../Components/Calendar'
// import styling for the page
import {
    Card,
    PrimaryButton,
    SubtitleText,
    TextInput,
    TitleText,
} from './../Styles/StyledComponents'

// styling options
const options = [
    { value: -100, label: 'In-Class', color: 'darkred' },
    { value: -1, label: 'Unpreferred', color: 'red' },
    { value: 0, label: 'Neutral', color: 'grey' },
    { value: 1, label: 'Preferred', color: 'green' },
]

// calander which will display the days for the employee
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

// Declaration of all of the usestates
export default function Account(props) {
    const { user, setUser } = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState(user)
    const [myPreferencesList, setMyPreferencesList] = useState([])
    const [dropdownValue, setDropdownValue] = useState(options[1])
    const [copyFrom, setCopyFrom] = useState('Select')
    const [copyTo, setCopyTo] = useState('Select')

    // Declaration for the mutation to update user attributes
    const [update, { data, loading }] = useMutation(UpdateUser)

    //Declaration for the preference list, as well as saving/pushing the preferences to an array
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

    // renders the schedule based on the day format
    const renderPreferenceSchedule = () => {
        let formats = {
            dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture),
        }
        // variable to hold the selected preference
        const handleSelectPreference = ({ start, end }) => {
            let color = 'green'

            // if statement to change the color of the preference based on the value of the preference
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

        //variable to Include copying events to different locations
        const movePreference = ({ event, start, end }) => {
            let { title, color, value } = event

            // window which will give the user the choice to proceed or decline the copy action
            const check = window.confirm(
                '\nCopy this event to new day?: Ok - YES, Cancel - NO'
            )
            // if statement to check for the preference and then push to the database
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

        // Styling and resizing for the preference
        const resizePreference = ({ event, start, end }) => {
            let index = myPreferencesList.indexOf(event)
            let { title, color, value } = event
            let tempArr = [...myPreferencesList]
            tempArr[index] = { title, color, start, end, value }
            setMyPreferencesList(tempArr)
        }

        // window which will give the user the choice to proceed or decline the delete action
        const handleDeletePreference = (event) => {
            const check = window.confirm(
                '\nDelete this event: Ok - YES, Cancel - NO'
            )
            // if statement to check for the preference and then delete the selected preference
            if (check) {
                let deleteSpot = myPreferencesList.indexOf(event)
                let tempArray = [...myPreferencesList]
                tempArray.splice(deleteSpot, 1)
                setMyPreferencesList(tempArray)
            }
        }

        // functions to handle the copied preference
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
                    // loop to take in each preference on the board and push them to the database
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
                        //styling for the preferences tag
                        style={{
                            fontSize: '3rem',
                            textAlign: 'left',
                        }}
                    >
                        Preferences
                    </TitleText>
                    <PrimaryButton
                        // button to log the state of the preferences
                        style={{
                            align: 'left',
                        }}
                        onClick={() => console.log(myPreferencesList)}
                    >
                        Log State
                    </PrimaryButton>
                    <PrimaryButton
                        // button to handle copying the preferences
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
                            // dropdown list to choose an option for the preferences for the beginning of the shift
                            options={options}
                            onChange={(x) => setDropdownValue(x)}
                            value={dropdownValue}
                            placeholder='Select an option'
                        />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SubtitleText>From</SubtitleText>
                            <Dropdown
                                // dropdown list to choose an option for the preferences for the end of the shift
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
        // function to get the total number of hours the employee has so they hit their weekly max on preferences
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
                    // button to call the function to submit all of the preferences to the database
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

                <MyCalendar
                    //Preferences calendar
                    defaultDate={new Date(2020, 2, 29)}
                    toolbar={false}
                    formats={formats}
                    events={myPreferencesList}
                    view={Views.WEEK}
                    onSelectEvent={handleDeletePreference}
                    onSelectSlot={handleSelectPreference}
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
    // function to update the various attributes of the employee in the database
    const validation = ({ email, firstName, lastName }) => {
        if (email === '' || firstName === '' || lastName === '')
            console.log('Bad Update')
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
                <SubtitleText>Here you can update your account information.</SubtitleText>
                <br />
                {/* {renderRow('email', 'Email')} */}
                {renderRow('firstName', 'First Name')}
                {renderRow('lastName', 'Last Name')}
                <PrimaryButton
                    // button to save the changes made to the employees account and pusht hem to the database
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
