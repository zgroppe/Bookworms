import React from 'react'
import { ProtectedRoute } from './App/Components/ProtectedRoute'
import Login from './App/Screens/Login'
import { Route, Switch } from 'react-router-dom'
import Screens from './App/Screens'
export default function App() {
	return (
		<div className='App'>
			<Switch>
				{/* This will make all screens as a route */}
				{Screens.map(screen => {
					if (screen.protected) {
						return (
							<ProtectedRoute
								exact
								path={`${screen.path}`}
								component={screen.component}
							/>
						)
					} else {
						return (
							<Route
								exact
								path={`${screen.path}`}
								component={screen.component}
							/>
						)
					}
				})}
				<Route path='*' component={Login} />
			</Switch>
		</div>
	)
}
