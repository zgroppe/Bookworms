import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

//API hook for the database mutation UpdateUser
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

//API hook for the database mutation CreateUser
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

//API hook for the database mutation DeleteUser
export const DeleteUser = gql`
    mutation deleteUser($email: String!) {
        deleteUser(email: $email)
    }
`

//API hook for the database mutation ClockIn
export const ClockIn = gql`
    mutation clockIn($location: String!, $time: String!, $email: String!) {
        clockIn(location: $location, time: $time, email: $email)
    }
`

//API hook for the database mutation ClockOut
export const ClockOut = gql`
    mutation clockOut($location: String!, $time: String!, $email: String!) {
        clockOut(location: $location, time: $time, email: $email)
    }
`