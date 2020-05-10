import React from 'react'
import { ProtectedRoute } from './App/Components/ProtectedRoute'
import Login from './App/Screens/Login'
import { Route, Switch } from 'react-router-dom'
import Screens from './App/Screens'
import './App/Styles/App.css'
import { AuthProvider } from './App/Components/Auth'
export default function App() {
    return (
        <AuthProvider>
            <Switch>
                <Route exact path='/' component={Login} />
                {Screens.map((screen) => {
                    return (
                        <ProtectedRoute
                            exact
                            path={`${screen.path}`}
                            component={screen.component}
                        />
                    )
                })}
                <Route path='*' component={Login} />
            </Switch>
        </AuthProvider>
    )
}
