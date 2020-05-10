import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'
export const GetUserByID = gql`
    query getUserByID($id: String!) {
        getUserByID(id: $id) {
            ${UserData}
        }
    }
`
export const GetUserByFirebaseID = gql`
    query getUserByFirebaseID($firebaseID: String!) {
        getUserByFirebaseID(firebaseID: $firebaseID) {
            ${UserData}
        }
    }
`
export const GetAllUsers = gql`
    query {
        getUsers {
            ${UserData}
        }
    }
`

export const GetAllUsersId = gql`
    query {
        getUsers {
            _id
        }
    }
`
