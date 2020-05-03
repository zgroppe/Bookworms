import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

export const UpdateUsersShifts = gql`
    mutation UpdateUsersShifts($users: [UpdateUserShift!]!) {
        updateUsersShifts(users: $users) {
            _id
        }
    }
`

export const AddTradeBoardShift = gql`
    mutation addTradeBoardShift(
        $shiftID: String!,
        $userID: String!
        ) {
        addTradeBoardShift(
            shiftID: $shiftID,
            userID: $userID
        )
    }
`

export const RemoveTradeBoardShift = gql`
    mutation removeTradeBoardShift(
        $shiftID: String!,
        $userID: String!
        ) {
        removeTradeBoardShift(
            shiftID: $shiftID,
            userID: $userID
        )
    }
`

export const AcceptPendingShift = gql`
    mutation acceptPendingShift(
        $shiftID: String!
        ) {
        acceptPendingShift(
            shiftID: $shiftID
        )
    }
`

export const DeclinePendingShift = gql`
    mutation declinePendingShift(
        $shiftID: String!
        ) {
        declinePendingShift(
            shiftID: $shiftID
        )
    }
`