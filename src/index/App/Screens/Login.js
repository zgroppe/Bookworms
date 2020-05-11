import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { ClockIn, ClockOut } from '../API/Mutations/User'
import { GetUserByFirebaseID } from '../API/Queries/User'
import Screens from '../Screens'
import '../Styles/Login.css'
import fb from './../../../firebase'
import { AuthContext } from './../Components/Auth'
import {
    Card,
    PrimaryButton,
    SubtitleText,
    TitleText,
} from './../Styles/StyledComponents'
const logo = require('../Images/IndaysLogo.png')
let userID = '5e84e996646154001efe8e80'
moment.locale('en')
// This will be changed to david's login component when it is finished
export default function Login(props) {
    const [userName, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [forgot, setForgot] = useState(false)
    const [update1, { loading: clockInLoading }] = useMutation(ClockIn)
    const [update2, { loading: clockOutLoading }] = useMutation(ClockOut)
    const [
        getUserByFirebaseID,
        { data: UserFromFirebaseID, loading: getUserLoading },
    ] = useLazyQuery(GetUserByFirebaseID)

    const { user, setUser } = useContext(AuthContext)

    const getLocation = (x) => {
        function CheckBrowser(position) {
            if (x === 'in') {
                update1({
                    variables: {
                        location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
                        time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        userID: userID,
                    },
                })
                console.log('CLOCK IN COMPLETE')
            } else if (x === 'out') {
                update2({
                    variables: {
                        location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
                        time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                        userID: userID,
                    },
                })
                console.log('CLOCK OUT COMPLETE')
            }
            console.log('Latitude is :', position.coords.latitude)
            console.log('Longitude is :', position.coords.longitude)
            console.log('Geo Success')
        }

        function ERROR() {
            console.log('Geo Failure')
        }

        if (!navigator.geolocation)
            console.log('Geolocation not supported by browser')
        else navigator.geolocation.getCurrentPosition(CheckBrowser, ERROR)
    }

    // This is called to auto-login a user if saved
    useEffect(() => {
        const storedFirebaseID = localStorage.getItem('currentUserFirebaseID')
        if (user) {
            props.history.push(Screens[0].path)
        } else if (!getUserLoading && storedFirebaseID) {
            getUserByFirebaseID({ variables: { firebaseID: storedFirebaseID } })
        }
    }, [getUserByFirebaseID, getUserLoading, props.history, setUser, user])

    // This is triggered when the user successfully logs in, or if their id was saved in localstorage
    useEffect(() => {
        if (UserFromFirebaseID) {
            console.log('UserFromFirebaseID')
            // They have a firebase account and a database account
            if (UserFromFirebaseID.getUserByFirebaseID) {
                console.log(
                    'UserFromFirebaseID.getUserByFirebaseID:',
                    UserFromFirebaseID.getUserByFirebaseID
                )
                const {
                    _id,
                    firebaseID,
                } = UserFromFirebaseID.getUserByFirebaseID
                localStorage.setItem('currentUserID', _id)
                localStorage.setItem('currentUserFirebaseID', firebaseID)
                setUser(UserFromFirebaseID.getUserByFirebaseID)
                props.history.push(Screens[0].path)
            } else {
                // They have a firebase account but no database account
                setError({
                    title: 'Error Logging You In',
                    message:
                        'Contact your administrator. Your account is missing database information)',
                })
                setLoading(false)
                // createUser({variables: { firebaseID, email: userName + '@islander.tamucc.edu', }})
            }
        }
    }, [UserFromFirebaseID, props.history, setUser])

    // Used to set one loading state if any of the functions are loading
    useEffect(() => {
        if (clockInLoading || clockOutLoading || getUserLoading)
            setLoading(true)
        else setLoading(false)
    }, [clockInLoading, clockOutLoading, getUserLoading])

    const formatUsername = () => {
        if (userName.includes('@')) return userName
        else return `${userName}@islander.tamucc.edu`
    }

    const handleLoginPressed = async (e) => {
        // Prevent screen refresh
        e.preventDefault()

        // Say it is loading
        setLoading(true)

        // Get the user's auth from firebase for their firebaseID
        try {
            const {
                user: { uid: firebaseID },
            } = await fb
                .auth()
                .signInWithEmailAndPassword(formatUsername(), password)

            // Get the full user from the database with that firebaseID
            getUserByFirebaseID({ variables: { firebaseID } })
        } catch (e) {
            // Display any errors
            setError({ title: 'Error!', message: e.message })
            // Set loading as done regardless
        } finally {
            setLoading(false)
        }
    }

    const renderAlert = () => {
        return (
            <Alert
                style={{ position: 'absolute', top: '3vh', right: '40vw' }}
                variant='danger'
                onClose={() => setError(false)}
                dismissible
            >
                <Alert.Heading>{error.title}</Alert.Heading>
                <p>{error.message}</p>
                <hr />

                <div className='d-flex justify-content-end'>
                    <PrimaryButton
                        onClick={() => setError(false)}
                        variant='outline-success'
                    >
                        Okay
                    </PrimaryButton>
                </div>
            </Alert>
        )
    }

    const renderForgotPassword = () => {
        return (
            <Alert
                style={{ position: 'absolute', top: '3vh', right: '40vw' }}
                variant='success'
                onClose={() => setForgot(false)}
                dismissible
            >
                <Alert.Heading>Password Reset Link Sent!</Alert.Heading>
                <p>
                    Intructions to reset your password have been sent to:{' '}
                    {formatUsername()}
                </p>
                <hr />
                <div className='d-flex justify-content-end'>
                    <PrimaryButton
                        onClick={() => setForgot(false)}
                        variant='outline-success'
                    >
                        Okay
                    </PrimaryButton>
                </div>
            </Alert>
        )
    }

    const handleResetPressed = async () => {
        try {
            await fb.auth().sendPasswordResetEmail(formatUsername())
            setForgot(true)
        } catch (e) {
            setError({ title: 'Error Resetting Password', message: e.message })
        }
    }

    const makeCard = () => {
        return (
            <Card>
                <div
                    style={{
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        width: '30vw',
                    }}
                >
                    <TitleText> Login</TitleText>
                    <SubtitleText>
                        Clock-in with your username
                        <br />
                        Log-in with your username and password
                    </SubtitleText>
                    <Form onSubmit={handleLoginPressed}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <InputGroup style={{ width: '60%' }}>
                                <FormControl
                                    placeholder='Username...'
                                    aria-label='Username'
                                    onChange={({ target: { value } }) =>
                                        setUsername(value)
                                    }
                                    style={{ width: '50%' }}
                                    autoComplete='username'
                                    type='text'
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text>
                                        @islander.tamucc.edu
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                            <Form.Text className='text-muted'>
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Password...'
                                onChange={({ target: { value } }) =>
                                    setPassword(value)
                                }
                                autoComplete='password'
                                style={{ width: '60%' }}
                            />
                            <u onClick={handleResetPressed}>Forgot Password?</u>
                        </Form.Group>
                        <PrimaryButton
                            disabled={loading || error}
                            type='submit'
                        >
                            Login
                        </PrimaryButton>
                    </Form>
                    <PrimaryButton
                        disabled={loading || error}
                        onClick={() => getLocation('in')}
                    >
                        Clock In
                    </PrimaryButton>
                    <PrimaryButton
                        disabled={loading || error}
                        onClick={() => getLocation('out')}
                    >
                        Clock Out
                    </PrimaryButton>
                </div>
            </Card>
        )
    }

    return (
        <div
            id='background'
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100vw',
                height: '100vh',
                justifyContent: 'space-around',
                alignItems: 'center',
            }}
        >
            <img
                src={logo}
                alt='indays logo'
                style={{
                    height: '30vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.53)',
                    borderRadius: '15vh',
                }}
            />
            {error && renderAlert()}
            {forgot && renderForgotPassword()}
            {makeCard()}
        </div>
    )
}
