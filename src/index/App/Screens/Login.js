import React from 'react'
import auth from '../Components/Auth'

// This will be changed to david's login component when it is finished
export default function Login(props) {
	return (
		<div>
			<h1>Login Page</h1>
			<button
				onClick={() => {
					auth.login(() => {
						props.history.push('/dashboard')
					})
				}}
			>
				Login
			</button>
		</div>
	)
}
