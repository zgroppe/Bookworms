import React from 'react'
import { ProtectedRoute } from './App/ProtectedRoute'
import { Login } from './App/Login'
import { ProtectedScreen } from './App/ProtectedScreen'
import { Route, Switch } from 'react-router-dom'

export default function App() {
	return (
		<div className='App'>
			<Switch>
				<Route exact path='/' component={Login} />
				{/* This is an example of a protected route */}
				<ProtectedRoute exact path='/app' component={ProtectedScreen} />
				{/* If you want to add a protected route, add it here */}

				{/* Don't delete this, but we may change it later. */}
				{/* This will be show the login screen if the user manually types a url */}
				<Route path='*' component={Login} />
			</Switch>
		</div>
	)
}
