import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

//API hook for the database mutation UpdateUsersShifts
export const UpdateUsersShifts = gql`
    mutation UpdateUsersShifts($users: [UpdateUserShift!]!) {
        updateUsersShifts(users: $users) {
            _id
        }
    }
`

//API hook for the database mutation AddTradeBoardShifts
export const AddTradeBoardShift = gql`
    mutation addTradeBoardShift(
        $shiftID: String!,
        $userID: String!
        ) {
        addTradeBoardShift(
            shiftID: $shiftID,
            userID: $userID
        ){_id}
    }
`

//API hook for the database mutation RemoveTradeBoardShift
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

//API hook for the database mutation AddPendingShift
export const AddPendingShift = gql`
    mutation addPendingShift(
        $toUserID: String!,
        $fromUserID: String!,
        $shiftID: String!
        ) {
        addPendingShift(
            toUserID: $toUserID,
            fromUserID: $fromUserID,
            shiftID: $shiftID
        )
    }
`

//API hook for the database mutation AcceptPendingShift
export const AcceptPendingShift = gql`
    mutation acceptPendingShift(
        $shiftID: String!
        ) {
        acceptPendingShift(
            shiftID: $shiftID
        )
    }
`

//API hook for the database mutation DeclinePendingShift
export const DeclinePendingShift = gql`
    mutation declinePendingShift(
        $shiftID: String!
        ) {
        declinePendingShift(
            shiftID: $shiftID
        )
    }
`