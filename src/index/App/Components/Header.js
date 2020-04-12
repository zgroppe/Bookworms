import React from 'react'
import Screens from '../Screens'
import {
	TitleText,
	SubtitleText
} from './../Styles/StyledComponents'
import Account from '../Screens/Account';
const LibraryLogo = require('../Images/LibraryLogo.png')
const Usericon = require('../Images/profileicon.PNG')
const Bell = require('../Images/bell.PNG')
export default function Header() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				height: '190px',
				width: '100vw',
				textAlign: 'center',
				backgroundColor:'white'
			}}
		>	
			<TitleText style={{ marginTop:'50px' }}>Employee Dashboard</TitleText>		
			<div
				style={{//for library logo
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
					style={{ height: '193px' }}	
				/>
			
				<img 
       			src={Usericon} 
        		alt="user icon" 
        		style={{alignItems: 'center', width: '70px',
				height: '70px', marginRight:'5px'}}
				//onClick={() => Screens[4].path}
        		/>
				<SubtitleText> John Deer </SubtitleText>
				<img 
       			src={Bell} 
        		alt="notification bell" 
        		style={{alignItems: 'center', width: '40px',
        		height: '52px', marginLeft:'20px'}}
        		/>
			</div>
		</div>
	)
}
