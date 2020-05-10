import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Header from './Header'
import Navbar from './Navbar'
import { AuthContext } from './Auth'
// This is the component that simply checks if the user is authenticated before proceeding to the route.
export const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user } = useContext(AuthContext)
    return (
        <Route
            {...rest}
            render={(props) => {
                if (user) {
                    return (
                        <div>
                            <Header />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Navbar />
                                <div
                                    style={{
                                        justifyContent: 'center',
                                        display: 'flex',
                                        flex: 'auto',
                                    }}
                                >
                                    <Component {...props} />
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return <Redirect to={'/'} />
                }
            }}
        />
    )
}
