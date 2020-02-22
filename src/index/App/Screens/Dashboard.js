import React from 'react'
import auth from '../Components/Auth'

export default function Dashboard(props) {
	return (
		<div>
			<h1>Dashboard</h1>
			<h3>This is some dashboard content</h3>
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
