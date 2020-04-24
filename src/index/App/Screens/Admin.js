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
import { CreateUser } from '../API/Mutations/User'

export default function Admin(props) {
    const [update, { loading, data, error }] = useMutation(CreateUser, {
        onCompleted(data) {
            if (data) window.alert(`User with this email:${email} has been created`)
            else window.alert(`Error`)

            setFirebaseID('')
            setEmail('')
            setFirstName('')
            setLastName('')
        }
    })

    const [firebaseID, setFirebaseID] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const renderRow = (state, setState, placeholder) => {
        return (
            <TextInput
                placeholder={placeholder}
                type='text'
                value={state}
                borderColor={state === '' && 'red'}
                onChange={e => setState(e.target.value)}
            />

        )
    }

    const renderSubmitButton = () => {
        const validation = () => {
            if (firebaseID !== '' && email !== '' && firstName !== '' && lastName !== '') {
                update({
                    variables: {
                        firebaseID: firebaseID,
                        first: firstName,
                        last: lastName,
                        email: email,
                        userType: 'Employee'
                    }
                })

            }
            //call api


        }
        return (
            <PrimaryButton onClick={() => validation()}>Create User</PrimaryButton>
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
            {renderRow(firebaseID, setFirebaseID, 'firebase ID')}
            {renderRow(email, setEmail, 'email')}
            {renderRow(firstName, setFirstName, 'first name')}
            {renderRow(lastName, setLastName, 'last name')}

            {renderSubmitButton()}
            {/* <h2>Example page for getting/refetching data</h2> */}
            {/* <h1>Name: {data.getUserByID.firstName}</h1> */}
            {/* <button onClick={() => refetch()}>Refetch.</button> */}
            {/* <h3>This is some settings content</h3> */}
        </div>
    )
}
