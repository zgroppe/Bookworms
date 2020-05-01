import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

export const UpdateUsersShifts = gql`
    mutation UpdateUsersShifts($users: [UpdateUserShift!]!) {
        updateUsersShifts(users: $users) {
            _id
        }
    }
`
