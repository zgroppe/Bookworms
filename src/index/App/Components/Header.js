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
			
				<img 
       			src={Usericon} 
        		alt="user icon" 
				style={{ 
				width: '4vw',
				height: '6vh', marginRight:'5px'}}
				//onClick={() => Screens[4].path}
        		/>
				<SubtitleText> John Deer </SubtitleText>
				<img 
       			src={Bell} 
        		alt="notification bell" 
				style={{ 
				width: '3vw',
        		height: '5vh', marginLeft:'20px'}}
        		/>
			</div>
		</div>
	)
}
