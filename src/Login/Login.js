import React, { useState } from 'react';
import './Login.css';
import Card from '../components/Card/Card';

export default function Login(props) {
	const [ userName, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');

	return (
		<Card>
			<div className="container">
				<h1>Login</h1>
				<p>
					Clock-in with your username<br />Log-in with your username and password
				</p>
			</div>
			<div className="container2">
				<input className="inputForm" />
				<input className="inputForm" />
			</div>
		</Card>
	);
}
