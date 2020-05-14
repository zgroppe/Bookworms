import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

//API hook for the database query GetTradeBoardShifts
export const GetTradeBoardShifts = gql`
    query {
        getTradeBoardShifts {
            _id
            title
            start
            end
            color
            available
            full_user{_id}
        }
    }
`

//API hook for the database query GetPendingShifts
export const GetPendingShifts = gql`
    query {
        getPendingShifts {
            _id
            title
            start
            end
            color
            available
            fromUserID
            toUserID
        }
    }
`