import React, { useState } from 'react';
// import './Login.css';
import { Card, TitleText, SubtitleText } from '../components/Card/Card';

export default function Login(props) {
	const [ userName, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');

	return (
		<Card>
			<div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
				{/* <h1>Login</h1> */}
				<TitleText>Login CHANGE</TitleText>
				<SubtitleText>
					Clock-in with your username<br />Log-in with your username and password
				</SubtitleText>
			</div>
			<div style={{ flexDirection: 'column', display: 'flex' }}>
				<input className="inputForm" />
				<input className="inputForm" />
			</div>
		</Card>
	);
}
