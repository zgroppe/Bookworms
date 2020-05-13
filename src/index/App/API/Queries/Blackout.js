import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

export const GetBlackouts = gql`
    query {
        getBlackouts {
            _id
            start
            end
        }
    }
`