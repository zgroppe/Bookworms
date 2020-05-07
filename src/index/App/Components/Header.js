import React from 'react'
import Screens from '../Screens'
import { Icon } from 'semantic-ui-react'
import {
	TitleText,
	Navlink,
	SubtitleText
} from './../Styles/StyledComponents'
import Account from '../Screens/Account';
const logo=require('../Images/IndaysLogo.png')
export default function Header() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				height: '190px',
				width: '100vw',
				textAlign: 'left',
				
			}}
		>	
			<TitleText style={{height: '190vh',
				width: '90vw', marginTop:'5vh'}}>Employee Dashboard</TitleText>		
			<div
				style={{
					flex: 1,
					display: 'flex',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					marginRight: '2vw',
					
				}}
			>
			
				<img
					align='middle'
					src={logo}
					alt='logo'
					style={{ height: '193px' }}	
				/>
			
			
				<Icon name='user circle' size='big'  />
				<SubtitleText> John Deer </SubtitleText>
				<Icon name='bell outline' size='large' />
			</div>
		</div>
	)
}
