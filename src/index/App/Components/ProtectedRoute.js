import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import auth from './Auth'
// This is the component that simply checks if the user is authenticated before proceeding to the route.
export const ProtectedRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props => {
				if (auth.isAuthenticated()) {
					return (
						<div style={{ flexDirection: 'row' }}>
							<Navbar />
							<Component {...props} />
						</div>
					)
				} else {
					return (
						<Redirect
							to={{
								pathname: '/',
								state: {
									from: props.location,
								},
							}}
						/>
					)
				}
			}}
		/>
	)
}
