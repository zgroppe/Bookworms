import React, { useContext, Component } from 'react'
import { NavLink } from 'react-router-dom'
import Screens from '../Screens'
//import { Navlink as Button } from './../Styles/StyledComponents'
import { AuthContext } from './Auth'
import { Button, Menu } from 'semantic-ui-react'
import { SecondButton} from './../Styles/StyledComponents'
export default function Navbar() {
    const { user } = useContext(AuthContext)
    let screensToRender = [...Screens]
    if (user.userType != 'Admin') {
        screensToRender = screensToRender.filter(
            ({ name }) => name !== 'Admin' && name !== 'Schedule'
        )
    }
    return (
        <ul
            className='Navbar'
            style={{
                fontfamily: 'Poppins',
                fontstyle: 'normal',
                fontweight: 'normal',
                height: '100vh',
                listStyle: 'none',
            }}
        >
            {/* This will make all screens as a navbar item */}
            {screensToRender.map((screen) => {
                return (     
                    <li>
                        <Button.Group widths='4'
                            className='tags'
                            exact={true}
                            as={NavLink}
                            to={`${screen.path}`}
                        >
                            <SecondButton>{screen.name}</SecondButton>
                        </Button.Group> 
                    </li>
                   
                )
            })}
        </ul>
    )
}
