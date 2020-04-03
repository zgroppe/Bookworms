import { useMutation, useQuery } from '@apollo/react-hooks'
import { GetAllUsers } from '../API/Queries/User'
import React from 'react'

/*
        Per Shift
*/
//InClass - -100
//Unpreferred - -1
//Neutral - -0
//Preferred - 1

/*
        Per Employee
*/
//Employee value - [0-4]


/*
        Special Case
*/
//inBetween Class && Preferred - 2
//inBetween Class && Neutral - 1

// const { loading, error, data, refetch, networkStatus } = useQuery(
//         GetAllUsers,
//         {
//             variables: { id: userID },
//             notifyOnNetworkStatusChange: true
//         }
//     )

export default function AutoPopulate(props){
        const { loading, error, data, refetch, networkStatus } = useQuery(GetAllUsers)
        console.log("ANYTHING")
        console.log(data.GetAllUsers)
        return 0
}