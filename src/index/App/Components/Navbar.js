import React from 'react'
import { NavLink } from 'react-router-dom'
import Screens from '../Screens'
import {
	Navlink
} from './../Styles/StyledComponents'
export default function Navbar() {
	return (
		<div
			className='Navbar'
			style={{
				fontfamily: 'Poppins',
				fontstyle: 'normal',
				fontweight: 'normal',
				display: 'block',
				height: '150vh',				
				width: '10vw',
				
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
								style={{}}
								activeStyle ={{}} 
								to={`${screen.path}`}	
							>
							<Navlink>
								{screen.name}
							</Navlink>
							</NavLink>
							
						</li>
					)
				})}
			</ul>
			<hr width='1' size='110vh' />
		</div>
	)
}
