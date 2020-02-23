import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Header from './Header'
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
						<div>
							<Header />
							<hr style={{ borderBlock: 0 }} />
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									// alignItems: 'center',
									// justifyContent: 'center',
								}}
							>
								<Navbar />
								<div
									style={{
										marginLeft: '10vw',
									}}
								>
									<Component {...props} />
								</div>
							</div>
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
