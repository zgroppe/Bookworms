import Screens from '../Screens'
import { Icon } from 'semantic-ui-react'
import { TitleText, Navlink, SubtitleText } from './../Styles/StyledComponents'
import Account from '../Screens/Account'
import React, { useContext } from 'react'
import { AuthContext } from './Auth'

const logo = require('../Images/IndaysLogo.png')
export default function Header() {
    const { user } = useContext(AuthContext)
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: '16vh',
                width: '100vw',
                textAlign: 'left',
            }}
        >
            <TitleText style={{ fontSize: '6rem' }}>
                Employee Dashboard
            </TitleText>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    marginRight: '2vw',
                    fontSize: '2rem',
                }}
            >
                <img
                    align='middle'
                    src={logo}
                    alt='logo'
                    style={{ height: '23vh' }}
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Icon name='user circle' size='big' />
                    <span>
                        {user.firstName} {user.lastName}
                    </span>
                </div>
            </div>
        </div>
    )
}
