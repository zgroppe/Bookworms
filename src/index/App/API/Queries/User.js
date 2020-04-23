import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'
export const GetUserByID = gql`
    query getUserByID($id: String!) {
        getUserByID(id: $id) {
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

export const getAllUsersId = gql`
query {
    getUsers {
        _id
    }
}
`