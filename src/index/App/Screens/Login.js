import '../Styles/Login.css'
import React, { useState } from 'react'
import auth from '../Components/Auth'
import Screens from '../Screens'
import { useMutation } from '@apollo/react-hooks'
import { ClockIn, ClockOut } from '../API/Mutations/User'
import { geolocated, geoPropTypes } from 'react-geolocated'
import moment from 'moment'

import {
	Card,
	CardTitle,
	Hyperlink,
	PrimaryButton,
	SubtitleText,
	TextInput,
	TitleText,
} from './../Styles/StyledComponents'

let userID = '5e84e996646154001efe8e80'
moment.locale('en')

// This will be changed to david's login component when it is finished
export default function Login(props) {
	const [userName, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [latitude, setLat] = useState('')
    const [longitude, setLong] = useState('')
	const icon1 = require('../Images/loginman.PNG')
	const icon2 = require('../Images/loginlock.PNG')
	const logo=require('../Images/IndaysLogo.png')

	const [update1] = useMutation(ClockIn)
	const [update2] = useMutation(ClockOut)
	
 	 const getLocation = (x) => {
        function CheckBrowser (position) {
            setLat(position.coords.latitude)
            setLong(position.coords.longitude)
			
			if(x === 'in')
			{
				update1({
					variables: {
						location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
						time: moment().format('MMMM Do YYYY, h:mm:ss a'),
						userID: userID
					}
				})
				console.log("CLOCK IN COMPLETE");
			}
			else if(x === 'out')
			{
				update2({
					variables: {
						location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
						time: moment().format('MMMM Do YYYY, h:mm:ss a'),
						userID: userID
					}
				})
				console.log("CLOCK OUT COMPLETE")
			}

			console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
			console.log("Geo Success");
        }
        
        function ERROR ()
        {
            console.log("Geo Failure");
        }

        if(!navigator.geolocation)
            console.log("Geolocation not supported by browser");
        else
            navigator.geolocation.getCurrentPosition(CheckBrowser, ERROR)
    };

  const back=require('../Images/stockbackground.jpg')	
  
	
	const makeCard = () => {
  	return (
			
		<Card>
		
			<div
				style={{
					textAlign: 'left',
					display: 'flex',
					justifyContent:'space-between',
					flexDirection: 'column',
					width: "700px",
					
				}}
			>
				
			<TitleText> Login</TitleText>
			
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
        height: '35px', top: 66, left: 140}}
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
        height: '30px', top: 145, left: 143}}
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

				{/* <SubtitleText>lat:{latitude}  long:{longitude}</SubtitleText> */}
                <PrimaryButton onClick={() => getLocation('in')}>Clock In</PrimaryButton>
				<PrimaryButton onClick={() => getLocation('out')}>Clock Out</PrimaryButton>


			</div>
		</Card>
		
	)
	}
	return(
		
			<div style={{
			display: 'flex',
			flexDirection:'row',
			background:<img src={back}/>
		}}>
		
		<img 
        src={logo} 
        alt="indays logo" 
        style={{
			marginRight:'200px',marginTop:'75px',
			width: '500px', height: '350px',	
		}}
			/>
		{makeCard()}
		
		
		</div>
	)
	
}
