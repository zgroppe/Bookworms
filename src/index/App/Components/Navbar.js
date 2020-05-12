import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import Screens from '../Screens'
import { Navlink as Button } from './../Styles/StyledComponents'
import { AuthContext } from './Auth'
export default function Navbar() {
    const { user } = useContext(AuthContext)
    const screensToRender = [...Screens]
    if (user.userType != 'Admin') {
        const foundIndex = screensToRender.findIndex(
            ({ name }) => name == 'Admin'
        )
        screensToRender.splice(foundIndex, 1)
    }
    return (
        <ul
            className='Navbar'
            style={{
                fontfamily: 'Poppins',
                fontstyle: 'normal',
                fontweight: 'normal',
                height: '100vh',
                width: 'auto',
                listStyle: 'none',
            }}
        >
            {/* This will make all screens as a navbar item */}
            {screensToRender.map((screen) => {
                return (
                    <li style={{ marginBottom: '3vh' }}>
                        <NavLink
                            className='tags'
                            exact={true}
                            to={`${screen.path}`}
                        >
                            <Button>{screen.name}</Button>
                        </NavLink>
                    </li>
                )
            })}
        </ul>
    )
}
