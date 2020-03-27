import React, { useState } from 'react'
import '../Styles/Login.css'
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
export default function Account(props) {
	const [updatedEmail, updateEmail] = useState('')
	const [updatedFName, updateFName] = useState('')
	const [updatedLName, updateLName] = useState('')
	const [updatedDays, updateDays] = useState('')
	const [updatedSHour, updateSHour] = useState('')
	const [updatedEHour, updateEHour] = useState('')
	const [updatedSColor, updateSColor] = useState('')
	const [FirebaseID, ValidateFirebaseID] = useState('')
	return (
		<div>

               

			<h1>Account</h1>
			<h3>Here you can update your account information. Please provide your FirebaseID in the box below before submitting any changes</h3>

			<h4>Provide your FirebaseID here</h4>
			<TextInput 
					placeholder='FirebaseID'
					type='text'
					value={FirebaseID}
					onChange={e => ValidateFirebaseID(e.target.value)}
				/>
			

			<h4>Update your email here</h4>
			<TextInput 
					placeholder='Email'
					type='text'
					value={updatedEmail}
					onChange={e => updateEmail(e.target.value)}
				/>
			<PrimaryButton
					onClick={() => {
						auth.login(() => {
							props.history.push(Screens[0].path)
						})
					}}
				>
					Update Email
			</PrimaryButton>

			<h4>Update your First and Last Name here</h4>
			<TextInput 
					placeholder='First Name'
					type='text'
					value={updatedFName}
					onChange={e => updateFName(e.target.value)}
				/>
				<PrimaryButton
					onClick={() => {
						auth.login(() => {
							props.history.push(Screens[0].path)
						})
					}}
				>
					Update First Name
			</PrimaryButton>
				<TextInput 
					placeholder='Last Name'
					type='text'
					value={updatedLName}
					onChange={e => updateLName(e.target.value)}
				/>
			<PrimaryButton
					onClick={() => {
						auth.login(() => {
							props.history.push(Screens[0].path)
						})
					}}
				>
					Update Last Name
			</PrimaryButton>

			<h4>Update your shift preferences here</h4>
			<TextInput 
					placeholder='Days'
					type='text'
					value={updatedDays}
					onChange={e => updateDays(e.target.value)}
				/>
				<TextInput 
					placeholder='Starting Hour'
					type='text'
					value={updatedSHour}
					onChange={e => updateSHour(e.target.value)}
				/>

                <TextInput 
					placeholder='Ending Hour'
					type='text'
					value={updatedEHour}
					onChange={e => updateEHour(e.target.value)}
				/>
				<TextInput 
					placeholder='Color on calendar'
					type='text'
					value={updatedSColor}
					onChange={e => updateSColor(e.target.value)}
				/>
				<PrimaryButton
					onClick={() => {
						auth.login(() => {
							props.history.push(Screens[0].path)
						})
					}}
				>
					Update Hour Preferences
			</PrimaryButton>
		</div>
			
		
	)

	
}
