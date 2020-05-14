import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import { ClockIn, ClockOut } from '../API/Mutations/User'
import { GetUserByFirebaseID } from '../API/Queries/User'
import Screens from '../Screens'
import '../Styles/Login.css'
import fb from './../../../firebase'
import { AuthContext } from './../Components/Auth'
import UsernameInput from './../Components/UsernameInput'
import {
    Card,
    PrimaryButton,
    SubtitleText,
    TitleText,
} from './../Styles/StyledComponents'
import { Input } from 'semantic-ui-react'
const logo = require('../Images/IndaysLogo.png')

moment.locale('en')
// This will be changed to david's login component when it is finished
export default function Login(props) {

    //states or variables consist of
    //username, password, loading, error and success
    const [userName, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const clockComplete = (type) => {
        setLoading(false)
        setSuccess(`You have been clocked ${type}`)
    }

    const [clockIn, { loading: clockInLoading }] = useMutation(ClockIn, {
        onError(e) {
            setError({ title: 'Error Clocking In!', message: e.message })
        },
        onCompleted({ clockIn }) {
            clockComplete('in')
        },
    })
    const [clockOut, { loading: clockOutLoading }] = useMutation(ClockOut, {
        onError(e) {
            setError({ title: 'Error Clocking Out!', message: e.message })
        },
        onCompleted({ clockOut }) {
            clockComplete('out')
        },
    })
    const [getUserByFirebaseID, { loading: getUserLoading }] = useLazyQuery(
        GetUserByFirebaseID,
        {
            onError(e) {
                setLoading(false)
                setError({ title: 'Error Logging In!', message: e.message })
                localStorage.clear()
            },
            onCompleted({ getUserByFirebaseID }) {
                setLoading(false)
                if (getUserByFirebaseID) {
                    const { _id, firebaseID } = getUserByFirebaseID
                    localStorage.setItem('currentUserID', _id)
                    localStorage.setItem('currentUserFirebaseID', firebaseID)
                    setUser(getUserByFirebaseID)
                    props.history.push('/overview')
                } else {
                    setError({
                        title: 'Error Logging In!',
                        message: 'Could not find a user with that ID',
                    })
                    localStorage.clear()
                }
            },
        }
    )

    const { user, setUser } = useContext(AuthContext)


    /*
    Function Name: getLocation
    Parameter: inOrOut - a string whether clock in 'in' or clock out 'out'

    The main functionality of this function is to check the clock in/clock out location
    */
    const getLocation = (inOrOut) => {
        function CheckBrowser({ coords: { latitude, longitude } }) {
            const variables = {
                location: `Latitude: ${latitude}, Longitude: ${longitude}`,
                time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                email: formatUsername(),
            }
            if (inOrOut === 'in') clockIn({ variables })
            else if (inOrOut === 'out') clockOut({ variables })
        }

        function ERROR(e) {
            setError({
                title: `Unable to Clock ${inOrOut}!`,
                message: e.message,
            })
        }

        //if navigator does not exist or is supported by the browser that  set error message
        //else - if the location is accessible then get the location
        if (!navigator.geolocation)
            setError({
                title: `Unable to Clock ${inOrOut}!`,
                message: 'Geolocation is not supported by your browser',
            })
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
    }, [getUserByFirebaseID, getUserLoading, props.history, user])

    // Used to set one loading state if any of the functions are loading
    useEffect(() => {
        if (clockInLoading || clockOutLoading || getUserLoading)
            setLoading(true)
        else setLoading(false)
    }, [clockInLoading, clockOutLoading, getUserLoading])


    /*
   Function Name: formatUsername
   Parameter: -

   The main functionality of this function is to check the entered email to log in includes a character '@' 
   if it includes @ and then use it normally
   if not then add '@islander.tamucc.edu'
   */
    const formatUsername = () => {
        if (userName.includes('@')) return userName
        else return `${userName}@islander.tamucc.edu`
    }


    /*
    Function Name: handleLoginPressed
    Parameter: e - native windows event

    The main functionality of this function is to set some context that is given from the database after the user login
    it handles login error as well, by showing a custom alert
    */
    const handleLoginPressed = async (e) => {
        // Prevent screen refresh or re-render 
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
            setError({ title: 'Error Logging In!', message: e.message })
            // Set loading as done regardless
        } finally {
            setLoading(false)
        }
    }


    /*
   Function Name: renderErrorAlert
   Parameter: -

   render function, it renders error alert 
   */
    const renderErrorAlert = () => {
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


    /*
   Function Name: renderSuccessAlert
   Parameter: -

   render function, it renders sunccess alert 
   */
    const renderSuccessAlert = () => {
        return (
            <Alert
                style={{ position: 'absolute', top: '3vh', right: '40vw' }}
                variant='success'
                onClose={() => setSuccess(false)}
                dismissible
            >
                <Alert.Heading>Success!</Alert.Heading>
                <p>{success}</p>
                <hr />
                <div className='d-flex justify-content-end'>
                    <PrimaryButton
                        onClick={() => setSuccess(false)}
                        variant='outline-success'
                    >
                        Okay
                    </PrimaryButton>
                </div>
            </Alert>
        )
    }


    /*
    Function Name: handleResetPressed
    Parameter: -

    it is an asynchronous function that handle users to reset their password,
    when the button is clicked, it checks the username whether it exist in the database then allow it to reset their password
    */
    const handleResetPressed = async () => {
        //if username string length is not enough the set error message
        if (userName.length < 2) {
            setError({
                title: 'Whoops!',
                message: 'Please enter your username to reset your password.',
            })
            return
        }
        try {
            await fb.auth().sendPasswordResetEmail(formatUsername())
            setSuccess(
                'A link to reset your pasword has been sent to your email!'
            )
        } catch (e) {
            setError({ title: 'Error Resetting Password', message: e.message })
        }
    }

    /*
   Function Name: makeCard
   Parameter: -

   render function, it renders the main card that consist all the of the main functionality in this screen such as
   header
   subheader
   email text input
   password text input
   forgot password button
   login button
   clock in button
   clock out button
   */
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
                        <UsernameInput
                            containerStyle={{
                                display: 'flex',
                                width: '62.5%',
                                flexDirection: 'column',
                            }}
                            onChange={(text) => setUsername(text)}
                            value={userName}
                        />
                        <Form.Group
                            style={{ flexDirection: 'column', display: 'flex' }}
                        >
                            <Form.Label>Password</Form.Label>
                            <Input
                                icon='lock'
                                iconPosition='left'
                                type='password'
                                placeholder='Password...'
                                onChange={({ target: { value } }) =>
                                    setPassword(value)
                                }
                                autoComplete='password'
                                style={{ width: '62.5%' }}
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

    //the whole screen consist background, main card, and alerts that are initially invisible
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
            {error && renderErrorAlert()}
            {success && renderSuccessAlert()}
            {makeCard()}
        </div>
    )
}
