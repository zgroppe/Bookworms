import React from 'react'
import auth from '../../shared/Auth'

// This will be changed to david's login component when it is finished
export const Login = props => {
	return (
		<div>
			<h1>Login Page</h1>
			<button
				onClick={() => {
					auth.login(() => {
						props.history.push('/app')
					})
				}}
			>
				Login
			</button>
		</div>
	)
}
