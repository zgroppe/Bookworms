import React from 'react'
import ReactDOM from 'react-dom'
import './index/index.css'
import App from './index/App'
import * as serviceWorker from './index/serviceWorker'
import * as firebase from 'firebase'
import { BrowserRouter } from 'react-router-dom'
// This will register our app with firebase, which will allow us to authenticate users.
const firebaseConfig = {
	apiKey: 'AIzaSyAD7niD0RondxddEZAn8jcz_WXsFMCeRNw',
	authDomain: 'auth-4baa3.firebaseapp.com',
	databaseURL: 'https://auth-4baa3.firebaseio.com',
	projectId: 'auth-4baa3',
	storageBucket: 'auth-4baa3.appspot.com',
	messagingSenderId: '887659037856',
	appId: '1:887659037856:web:dc94522a2d2c1c29e635c5',
}
firebase.initializeApp(firebaseConfig)

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
