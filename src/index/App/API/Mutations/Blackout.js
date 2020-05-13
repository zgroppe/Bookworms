import { gql } from 'apollo-boost'
import { UserData } from '../UserDataConstant'

export const CreateBlackout = gql`
    mutation createBlackout(
        $start: String!,
        $end: String!
    ) {
        createBlackout(
            start: $start,
            end: $end
        ){_id}
    }
`