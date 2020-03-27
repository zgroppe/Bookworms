import ApolloClient from 'apollo-boost'

// Client Docs: https://www.apollographql.com/docs/react/

const Client = new ApolloClient({
    uri: 'https://bookworms-api.herokuapp.com/graphql'
})

export default Client
