import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GetUserByID } from '../API/Queries/User'

export default function Settings(props) {
    const { loading, error, data, refetch, networkStatus } = useQuery(
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
            <h1>Settings</h1>
            <h2>Example page for getting/refetching data</h2>
            <h1>Name: {data.getUserByID.firstName}</h1>
            <button onClick={() => refetch()}>Refetch.</button>
            <h3>This is some settings content</h3>
        </div>
    )
}
