import React from 'react';
import { ProtectedRoute } from './App/Components/ProtectedRoute';
import Login from './App/Screens/Login';
import { Route, Switch } from 'react-router-dom';
import Screens from './App/Screens';
import './App/Styles/App.css';
export default function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Switch>
					{/* This will make all screens as a route */}
					<Route exact path="/" component={Login} />
					{Screens.map((screen) => {
						return <ProtectedRoute exact path={`${screen.path}`} component={screen.component} />;
					})}
					<Route path="*" component={Login} />
				</Switch>
			</header>
		</div>
	);
}
