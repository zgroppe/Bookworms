import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from '../../shared/Auth'

// This is the component that simply checks if the user is authenticated before proceeding to the route.
export const ProtectedRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props => {
				if (auth.isAuthenticated()) {
					return <Component {...props} />
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
