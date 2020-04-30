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
    const [weeklyMax, setWeeklyMax] = useState(0)
    const [dailyMax, setDailyMax] = useState(0)

    const renderRow = (state, setState, placeholder) => {
        return (
            <TextInput
                placeholder={placeholder}
                type='text'
                value={state}
                borderColor={(state === '' || state === 0) && 'red'}
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
            /*
            if (weeklyMax !== 0 && dailyMax !== 0) {
                update3({
                    variables: {
                        SOMETHING WILL GO HERE... EVENTUALLY
                    }
                })

            }
            */
            //call api
            console.log('TEST 123')
        }
        return (
            <PrimaryButton onClick={() => validation()}>Adjust Hour Maxes</PrimaryButton>
        )
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

            {renderRow(weeklyMax, setWeeklyMax, weeklyMax.value)}
            {renderRow(dailyMax, setDailyMax, dailyMax.value)}
            {renderHoursButton()}    

            {/* <h2>Example page for getting/refetching data</h2> */}
            {/* <h1>Name: {data.getUserByID.firstName}</h1> */}
            {/* <button onClick={() => refetch()}>Refetch.</button> */}
            {/* <h3>This is some settings content</h3> */}
        </div>
    )
}
