import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

//API hook for the database query GetBlackouts
export const GetBlackouts = gql`
    query {
        getBlackouts {
            _id
            start
            end
        }
    }
`