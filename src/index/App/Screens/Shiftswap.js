import React from 'react'
import auth from '../Components/Auth'

export default function Shiftswap(props) {
	return (
		<div>
			<h1>Shiftswap</h1>
			<h3>Some content about shift swap</h3>
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
