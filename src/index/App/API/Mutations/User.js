import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

export const UpdateUser = gql`
    mutation updateUser(
        $id: String!
        $first: String
        $last: String
        $email: String
        $preferences: [UpdateEventInput!]
        $shifts: [UpdateEventInput!]
    ) {
        updateUser(
            _id: $id
            firstName: $first
            lastName: $last
            email: $email
            preferences: $preferences
            shifts: $shifts
        ) { ${UserData} }
            
    }
`

export const CreateUser = gql`
    mutation createUser(
        $firebaseID: String!
        $first: String!
        $last: String!
        $userType: String!
        $email: String!

    ) {
        createUser(
            firebaseID: $firebaseID
            firstName: $first
            lastName: $last
            userType: $userType
            email: $email
        ) { ${UserData} }
            
    }
`

export const DeleteUser = gql`
    mutation deleteUser(
        $id: String!
    ) {
        deleteUser(
            id: $id
        )
            
    }
`

export const ClockIn = gql`
    mutation clockIn(
        $location: String!,
        $time: String!,
        $userID: String!
    ) {
        clockIn(
            location: $location,
            time: $time,
            userID: $userID
        )
            
    }
`

export const ClockOut = gql`
    mutation clockOut(
        $location: String!,
        $time: String!,
        $userID: String!
    ) {
        clockOut(
            location: $location,
            time:$time,
            userID: $userID
        )
            
    }
`