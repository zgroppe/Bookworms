import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { PrimaryButton } from './../Styles/StyledComponents'
import { CreateUser, DeleteUser } from '../API/Mutations/User'
// import { AuthContext } from './../Components/Auth'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import fb from './../../../firebase'
import Alert from 'react-bootstrap/Alert'
import UsernameInput from './../Components/UsernameInput'

export default function Admin(props) {
    // const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState('')
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userType, setUserType] = useState('Employee')
    const [deleteEmail, setDeleteEmail] = useState('')
    // const [weeklyMax, setWeeklyMax] = useState(null)
    // const [dailyMax, setDailyMax] = useState(null)
    const [error, setError] = useState(false)

    const [createUser, { loading: createLoading }] = useMutation(CreateUser, {
        onError(e) {
            setError({ title: 'Error Creating User!', message: e.message })
        },
        onCompleted({ createUser }) {
            setSuccess(
                `${createUser.firstName}'s account has been successfully created!`
            )
            setLoading(false)
            setEmail('')
            setFirstName('')
            setLastName('')
            setPassword('')
            setUserType('Employee')
        },
    })

    const [deleteUser, { loading: deleteLoading }] = useMutation(DeleteUser, {
        onError(e) {
            setError({ title: 'Error Deleting User!', message: e.message })
        },
        onCompleted({ deleteUser }) {
            setLoading(false)
            if (deleteUser) {
                setSuccess('User successfully deleted!')
                setDeleteEmail('')
            } else {
                setError({
                    title: 'Error Deleting User!',
                    message: 'Unable to find a user with that email.',
                })
            }
        },
    })

    // Set loading to true if anything is loading
    useEffect(() => {
        if (createLoading || deleteLoading) setLoading(true)
    }, [createLoading, deleteLoading])

    const handleDeleteUser = async (e) => {
        e.preventDefault()
        deleteUser({ variables: { email: formatEmail(deleteEmail) } })
    }

    const formatEmail = (state) => {
        if (state.includes('@')) return state
        else return `${state}@islander.tamucc.edu`
    }

    const handleCreateUser = async (e) => {
        e.preventDefault()
        if (firstName.length < 1) {
            setError({
                title: 'Cannot Create user.',
                message: 'A first name is required.',
            })
        } else if (lastName.length < 1) {
            setError({
                title: 'Cannot Create user.',
                message: 'A last name is required.',
            })
        } else {
            try {
                //    Create user in firebase for authentication
                const {
                    user: { uid: firebaseID, email: firebaseEmail },
                } = await fb
                    .auth()
                    .createUserWithEmailAndPassword(
                        formatEmail(email),
                        password
                    )
                // Create user in the database to store information
                createUser({
                    variables: {
                        firebaseID,
                        first: firstName,
                        last: lastName,
                        userType,
                        email: firebaseEmail,
                    },
                })
            } catch (e) {
                setError({ title: 'Error Creating User!', message: e.message })
            }
        }
    }

    const genericAlert = (type) => {
        let onPress = () => setSuccess(false)
        let title = 'Success!'
        let message = success
        let variant = 'success'
        if (type === 'error') {
            onPress = () => setError(false)
            title = error.title
            message = error.message
            variant = 'danger'
        }
        return (
            <Alert
                style={{ position: 'absolute', top: '3vh', right: '40vw' }}
                variant={variant}
                onClose={onPress}
                dismissible
            >
                <Alert.Heading>{title}</Alert.Heading>
                <p>{message}</p>
                <hr />

                <div className='d-flex justify-content-end'>
                    <PrimaryButton onClick={onPress} variant='outline-success'>
                        Okay
                    </PrimaryButton>
                </div>
            </Alert>
        )
    }

    const renderErrorAlert = () => {
        return genericAlert('error')
    }

    const renderSuccessAlert = () => {
        return genericAlert('success')
    }

    return (
        <div style={{ width: '80%' }}>
            <h1>Admin</h1>
            {error && renderErrorAlert()}
            {success && renderSuccessAlert()}
            <h2>Create</h2>
            <Form onSubmit={(e) => handleCreateUser(e)}>
                <Form.Row>
                    <UsernameInput
                        as={Col}
                        containerStyle={{ width: '100%' }}
                        onChange={(text) => setEmail(text)}
                    />
                    <Form.Group as={Col} controlId='formGridPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={({ target: { value } }) =>
                                setPassword(value)
                            }
                            type='password'
                            placeholder='Password...'
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            onChange={({ target: { value } }) =>
                                setFirstName(value)
                            }
                            type='text'
                            placeholder='First Name...'
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            onChange={({ target: { value } }) =>
                                setLastName(value)
                            }
                            type='text'
                            placeholder='Last Name...'
                        />
                    </Form.Group>
                </Form.Row>
                <ListGroup as='ul'>
                    <ListGroup.Item
                        as='li'
                        onClick={() => setUserType('Employee')}
                        active={userType === 'Employee'}
                    >
                        Employee
                    </ListGroup.Item>
                    <ListGroup.Item
                        active={userType === 'Admin'}
                        onClick={() => setUserType('Admin')}
                        as='li'
                    >
                        Admin
                    </ListGroup.Item>
                </ListGroup>
                <PrimaryButton disabled={loading || error} type='submit'>
                    Create User
                </PrimaryButton>
            </Form>
            <h2>Delete</h2>
            <Form onSubmit={(e) => handleDeleteUser(e)}>
                <UsernameInput
                    containerStyle={{ width: '30%' }}
                    onChange={(text) => setDeleteEmail(text)}
                />
                <PrimaryButton disabled={loading || error} type='submit'>
                    Delete User
                </PrimaryButton>
            </Form>
            {/* <h2>Hours</h2>
            <Form>
                <Form.Group>
                    <Form.Label>Weekly Max</Form.Label>
                    <Form.Control type='text' placeholder='Weekly Max' />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Daily Max</Form.Label>
                    <Form.Control type='text' placeholder='Daily Max' />
                </Form.Group>
                <PrimaryButton type='submit'>
                Adjust Hour Maxes
            </PrimaryButton>
                {renderHoursButton()}
            </Form> */}
        </div>
    )
}
