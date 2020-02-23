import React, { useState } from 'react';
// import './Login.css';
import { Card, TitleText, SubtitleText, TextInput, PrimaryButton, Hyperlink } from '../components/StyledComponents';
import Button from 'react-bootstrap/Button';
import MenuIcon from '@material-ui/icons/Menu';
export default function Login(props) {
	const [ userName, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	let icon = <MenuIcon />;
	return (
		<Card>
			<div
				style={{
					textAlign: 'left',
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
					width: '35vw'
				}}
			>
				{/* <h1>Login</h1> */}
				<TitleText>Login</TitleText>
				<SubtitleText>
					Clock-in with your username<br />Log-in with your username and password
				</SubtitleText>
			</div>
			<div
				style={{
					flexDirection: 'column',
					padding: '4vh',
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center'
				}}
			>
				<TextInput
					placeholder="username"
					type="text"
					value={userName}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextInput
					placeholder="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<div style={{ width: '20vw', display: 'flex', justifyContent: 'flex-end' }}>
					<Hyperlink href="https://styled-components.com/">forgot password</Hyperlink>
				</div>
				<PrimaryButton onClick={() => console.log(userName)}>Login</PrimaryButton>
			</div>
		</Card>
	);
}
