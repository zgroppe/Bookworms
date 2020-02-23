import React from 'react'
import auth from '../Components/Auth'
import Screens from '../Screens'
// This will be changed to david's login component when it is finished
export default function Login(props) {
	return (
		<div>
			<h1>Login Page</h1>
			<button
				onClick={() => {
					auth.login(() => {
						props.history.push(Screens[0].path)
					})
				}}
			>
				Login
			</button>
		</div>
	)
}
