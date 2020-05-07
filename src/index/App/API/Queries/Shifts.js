import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

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