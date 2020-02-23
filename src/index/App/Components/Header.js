import React from 'react'
import { MdPersonOutline, MdNotificationsNone } from 'react-icons/md'
const LibraryLogo = require('../Images/LibraryLogo.png')

export default function Header() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				height: '9vh',
				width: '100vw',
				textAlign: 'center',
				padding: 0,
			}}
		>
			<div
				style={{
					flex: 1,
					display: 'flex',
					marginLeft: '2vw',
				}}
			>
				<h1>Employee Dashboard</h1>
			</div>
			<div
				style={{
					flex: 1,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginRight: '2vw',
				}}
			>
				<img
					align='middle'
					src={LibraryLogo}
					alt='Library Logo'
					style={{ height: '9vh' }}
				/>
				<MdPersonOutline style={{ fontSize: '9vh' }} />
				<p>John Deer</p>
				<MdNotificationsNone style={{ fontSize: '9vh' }} />
			</div>
		</div>
	)
}
