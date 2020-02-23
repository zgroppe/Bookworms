import React from 'react'
import { NavLink } from 'react-router-dom'
import Screens from '../Screens'
export default function Navbar() {
	return (
		<div
			className='Navbar'
			style={{
				display: 'flex',
				height: '100vh',
				width: '10vw',
				padding: 0,
			}}
		>
			<ul>
				{/* This will make all screens as a navbar item */}
				{Screens.map(screen => {
					return (
						<li>
							<NavLink
								className='tags'
								exact={true}
								activeStyle={{
									fontWeight: 'bold',
									backgroundColor: 'blue',
								}}
								to={`${screen.path}`}
							>
								{screen.name}
							</NavLink>
						</li>
					)
				})}
			</ul>
			<hr width='1' size='110vh' />
		</div>
	)
}
