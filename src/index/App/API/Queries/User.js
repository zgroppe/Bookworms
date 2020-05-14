import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

//API hook for the database query GetUserByID
export const GetUserByID = gql`
    query getUserByID($id: String!) {
        getUserByID(id: $id) {
            ${UserData}
        }
    }
`

//API hook for the database query GetUserByFirebaseID
export const GetUserByFirebaseID = gql`
    query getUserByFirebaseID($firebaseID: String!) {
        getUserByFirebaseID(firebaseID: $firebaseID) {
            ${UserData}
        }
    }
`

//API hook for the database query GetAllUsers
export const GetAllUsers = gql`
    query {
        getUsers {
            ${UserData}
        }
    }
`

//API hook for the database query GetAllUsersId
export const GetAllUsersId = gql`
    query {
        getUsers {
            _id
        }
    }
`