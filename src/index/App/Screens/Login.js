import '../Styles/Login.css'

import React, { useState } from 'react'

import auth from '../Components/Auth'
import Screens from '../Screens'
import {
	Card,
	Hyperlink,
	PrimaryButton,
	SubtitleText,
	TextInput,
	TitleText,
} from './../Styles/StyledComponents'

// This will be changed to david's login component when it is finished
export default function Login(props) {
	const [userName, setUsername] = useState('')
	const [password, setPassword] = useState('')
  const icon1 = require('../Images/loginman.PNG')
  const icon2 = require('../Images/loginlock.PNG')
  const logo=require('../Images/IndaysLogo.png')
	
	return (
			
		<Card>
			<div
				style={{
					textAlign: 'left',
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
					width: "700px",
				}}
			>
			
				<TitleText>Login</TitleText>
				<img 
        src={logo} 
        alt="indays logo" 
        style={{position:'absolute',right:'600px',top:'175px',width: '200px', height: '150px', 
	}}
        />
		<SubtitleText>
					Clock-in with your username
					<br />
					Log-in with your username and password
				</SubtitleText>
			</div>
      <div 
      style={{
        position: 'relative',
        width: '5px',
        height: '5px'
      }}
      >
      <img 
        src={icon1} 
        alt="username icon" 
        style={{position: 'absolute', width: '35px',
        height: '35px', top: 66, left: 160}}
        />
        </div>
        <div 
      style={{
        position: 'relative',
        width: '5px',
        height: '5px'
      }}
      >
      <img 
        src={icon2} 
        alt="lock icon" 
        style={{position: 'absolute', width: '30px',
        height: '30px', top: 145, left: 163}}
        />
        </div>
			<div
				style={{
					flexDirection: 'column',
					padding: '4vh',
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<TextInput
					placeholder='username'
					type='text'
					value={userName}
					onChange={e => setUsername(e.target.value)}
				/>
				<TextInput
					placeholder='password'
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<div
					style={{
						width: '20vw',
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Hyperlink href=''>
						forgot password?
					</Hyperlink>
				</div>
				<PrimaryButton
					onClick={() => {
						auth.login(() => {
							props.history.push(Screens[0].path)
						})
					}}
				>
					Login
				</PrimaryButton>
			</div>
		</Card>
		
	)
	
}
