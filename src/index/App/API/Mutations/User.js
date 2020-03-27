import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

export const UpdateUser = gql`
    mutation updateUser(
        $id: String!
        $first: String
        $last: String
        $email: String
        $preferences: [UpdateEventInput!]
        $shifts: [UpdateEventInput!]
    ) {
        updateUser(
            _id: $id
            firstName: $first
            lastName: $last
            email: $email
            preferences: $preferences
            shifts: $shifts
        ) { ${UserData} }
            
    }
`
