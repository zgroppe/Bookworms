import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login/Login';
function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Login />
				{/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edissssst <code>src/ App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
			</header>
		</div>
	);
}

export default App;
