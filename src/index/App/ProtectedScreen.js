import React from 'react'
import auth from '../../shared/Auth'

export const ProtectedScreen = props => {
	return (
		<div>
			<h1>ProtectedScreen</h1>
			<h3>This is the first of many protected screens :)</h3>
			<button
				onClick={() => {
					auth.logout(() => {
						props.history.push('/')
					})
				}}
			>
				Logout
			</button>
		</div>
	)
}
