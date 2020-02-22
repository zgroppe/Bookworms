import React from 'react'
import { NavLink } from 'react-router-dom'
import Screens from '../Screens'
export default function Navbar() {
	return (
		<div
			className='Navbar'
			style={{
				float: 'left',
				width: '10%',
				background: '#ccc',
				padding: '20px',
			}}
		>
			<ul>
				{/* This will make all screens as a navbar item */}
				{Screens.map(screen => {
					return (
						<li>
							<NavLink
								exact={true}
								activeStyle={{
									fontWeight: 'bold',
									color: 'blue',
								}}
								to={`${screen.path}`}
							>
								{screen.name}
							</NavLink>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
