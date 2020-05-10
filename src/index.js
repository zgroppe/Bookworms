import React from 'react'
import ReactDOM from 'react-dom'
import './index/index.css'
import App from './index/App'
import * as serviceWorker from './index/serviceWorker'
import { BrowserRouter } from 'react-router-dom'

import { ApolloProvider } from '@apollo/react-hooks'
import Client from './index/App/API/Client'

// This will register our app with firebase, which will allow us to authenticate users.

ReactDOM.render(
    <ApolloProvider client={Client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
