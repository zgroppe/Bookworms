import React from 'react'
export default function Header(props) {
	return (
		<div
			style={{
				flexDirection: 'row',
				height: '3.5%',
				width: '100%',
				alignContent: 'center',
				alignItems: 'center',
				justifyItems: 'center',
			}}
		>
			<h1>This is the static header when a user is logged in.</h1>
			<span>This should be updated to look like figma.</span>
			<hr />
		</div>
	)
}
