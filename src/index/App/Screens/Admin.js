import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'

import { GetUserByID } from '../API/Queries/User'
import {
    Card,
    Hyperlink,
    PrimaryButton,
    SubtitleText,
    TextInput,
    TitleText
} from './../Styles/StyledComponents'
import { CreateUser, DeleteUser } from '../API/Mutations/User'

export default function Admin(props) {
   //const[update] = useMutation(CreateUser, DeleteUser)
    const userID = localStorage.getItem('currentUserID')
   
    const [update, { loading, data, error }] = useMutation(CreateUser, {
        onCompleted(data) {
            if (data) window.alert(`User with this email: ${email} has been created`)
            else window.alert(`Error`)

            setFirebaseID('')
            setEmail('')
            setFirstName('')
            setLastName('')
        }
    })

    const [update2, { loading: loading2, data: deleteData, error: error2 }] = useMutation(DeleteUser, {
        onCompleted(deleteData) {
            if (deleteData) window.alert(`User with this ID: ${deleteID} has been deleted`)
            else window.alert(`Error`)

            setDeleteID('')
        }
    })

    const { loading: loading3, error: error3, data: data3, refetch: refetch3, networkStatus: networkStatus3 } = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true
        }
    )

    /*
    const [update3, { loading: loading3, data: data3, error: error3 }] = useMutation(AdjustMaxes, {
        onCompleted(data3) {
            if (data3) window.alert(`Weekly Max: ${weeklyMax}, Daily Max: ${dailyMax}`)
            else window.alert(`Error`)
        }
    })
    */

    const [firebaseID, setFirebaseID] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userType, setUserType] = useState('')
    const [deleteID, setDeleteID] = useState('')
    const [weeklyMax, setWeeklyMax] = useState(null)
    const [dailyMax, setDailyMax] = useState(null)

    if (loading3) return <p>Loading...</p>
   if (error3) return <p>Error :( {JSON.stringify(error2)}</p>
   if (networkStatus3 === 4) return <p>Refetching...</p>

    const renderRow = (state, setState, placeholder) => {
        return (
            <TextInput
                placeholder={placeholder}
                type='text'
                value={state}
                borderColor={(state === '' || state === 0 || state === null) && 'red'}
                onChange={e => setState(e.target.value)}
            />

        )
    }

    const renderSubmitButton = () => {
        const validation = () => {
            if (firebaseID !== '' && email !== '' && firstName !== '' && lastName !== '' && userType !== '') {
                update({
                    variables: {
                        firebaseID: firebaseID,
                        first: firstName,
                        last: lastName,
                        email: email,
                        userType: userType
                    }
                })

            }
            //call api
        }
        return (
            <PrimaryButton onClick={() => validation()}>Create User</PrimaryButton>
        )
    }

    const renderDeleteButton = () => {
        const validation = () => {
            if (deleteID !== '' ) {
                update2({
                    variables: {
                        id: deleteID
                    }
                })

            }
            //call api
        }
        return (
            <PrimaryButton onClick={() => validation()}>Delete User</PrimaryButton>
        )
    }

    const renderHoursButton = () => {
        const validation = () => {
            if (weeklyMax !== 0 && dailyMax !== 0) {
                localStorage.setItem('currentWeeklyMax', weeklyMax)
                localStorage.setItem('currentDailyMax', dailyMax)
            }
            console.log('TEST 123')
            window.alert('New weekly and daily maxes have been set.')
            //console.log(localStorage.getItem('currentWeeklyMax'))
            setWeeklyMax(null)
            setDailyMax(null)
        }
        return (
            <PrimaryButton onClick={() => validation()}>Adjust Hour Maxes</PrimaryButton>
        )
    }

    const adminCheck = () => {
        if(data3.getUserByID.userType === 'Admin')
		{
            return(
                <div>
                    <h1>Admin</h1>

                    <h2>Create</h2>
                    {renderRow(firebaseID, setFirebaseID, 'firebase ID')}
                    {renderRow(email, setEmail, 'email')}
                    {renderRow(firstName, setFirstName, 'first name')}
                    {renderRow(lastName, setLastName, 'last name')}
                    {renderRow(userType, setUserType, 'user type')}
                    {renderSubmitButton()}

                    <h2>Delete</h2>

                    {renderRow(deleteID, setDeleteID, 'ID')}
                    {renderDeleteButton()}

                    <h2>Hours</h2>

                    {renderRow(weeklyMax, setWeeklyMax, 'weekly max')}
                    {renderRow(dailyMax, setDailyMax, 'daily max')}
                    {renderHoursButton()}    
                </div>
            )
        }
        else {
            return(
                <div>
                    <h1>
                        This is an admin only page!<br></br>If you are seeing this,<br></br>please leave this page immediately
                    </h1>
                </div>
            )
        }
    }

    // const { loading, error, data, refetch, networkStatus } = useQuery(
    //     GetUserByID,
    //     {
    //         variables: { id: '5e795c57a7e84353d4d1d47b' },
    //         notifyOnNetworkStatusChange: true
    //     }
    // )
    // if (loading) return <p>Loading...</p>
    // if (error) return <p>Error :( {JSON.stringify(error)}</p>
    // if (networkStatus === 4) return <p>Refetching...</p>
    return (
        <div>
            {adminCheck()}
            {/* <h1>Admin</h1>

            <h2>Create</h2>
            {renderRow(firebaseID, setFirebaseID, 'firebase ID')}
            {renderRow(email, setEmail, 'email')}
            {renderRow(firstName, setFirstName, 'first name')}
            {renderRow(lastName, setLastName, 'last name')}
            {renderRow(userType, setUserType, 'user type')}
            {renderSubmitButton()}

            <h2>Delete</h2>

            {renderRow(deleteID, setDeleteID, 'ID')}
            {renderDeleteButton()}

            <h2>Hours</h2>

            {renderRow(weeklyMax, setWeeklyMax, weeklyMax.value)}
            {renderRow(dailyMax, setDailyMax, dailyMax.value)}
            {renderHoursButton()}     */}

            {/* <h2>Example page for getting/refetching data</h2> */}
            {/* <h1>Name: {data.getUserByID.firstName}</h1> */}
            {/* <button onClick={() => refetch()}>Refetch.</button> */}
            {/* <h3>This is some settings content</h3> */}
        </div>
    )
}
