import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Card, PrimaryButton, TitleText, SubtitleText } from './../Styles/StyledComponents'
import { CreateUser, DeleteUser } from '../API/Mutations/User'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import { Input, Button } from 'semantic-ui-react'
import fb from './../../../firebase'
import Alert from 'react-bootstrap/Alert'
import UsernameInput from './../Components/UsernameInput'
// declaration for all use states 
export default function Admin(props) {
    const [loading, setLoading] = useState('')
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isEmployee, setIsEmployee] = useState(true)
    const [deleteEmail, setDeleteEmail] = useState('')
    const [error, setError] = useState(false)

    // declaration of the mutation to create a user
    const [createUser, { loading: createLoading }] = useMutation(CreateUser, {
        onError(e) {
            setError({ title: 'Error Creating User!', message: e.message })
        },
        onCompleted({ createUser }) {
            setEmail('')
            setFirstName('')
            setLastName('')
            setPassword('')
            setSuccess(
                `${createUser.firstName}'s account has been successfully created!`
            )
            setLoading(false)
            setIsEmployee(true)
        },
    })

    // declaration of the mutation to delete a user
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

    // deletes the user based on the email
    const handleDeleteUser = async (e) => {
        e.preventDefault()
        deleteUser({ variables: { email: formatEmail(deleteEmail) } })
    }

    // formtas the email to whatever email the users should be using in the work site such as a company email
    const formatEmail = (state) => {
        if (state.includes('@')) return state
        else return `${state}@islander.tamucc.edu`
    }

    // handler to check for invalid fields such as leaving the first or last name blank when trying to create a user
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
                        userType: isEmployee ? 'Employee' : 'Admin',
                        email: firebaseEmail,
                    },
                })
            } catch (e) {
                setError({ title: 'Error Creating User!', message: e.message })
            }
        }
    }

    // Alert to let the admin know whether or not the action worked or failed
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

    // graphical alerts for success or error
    const renderErrorAlert = () => {
        return genericAlert('error')
    }

    const renderSuccessAlert = () => {
        return genericAlert('success')
    }

    const renderInput = ({
        title,
        onChange,
        type = 'text',
        icon,
        autoComplete,
        value,
    }) => {
        return (
            <Form.Group
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <Form.Label>{title}</Form.Label>
                <Input
                    icon={icon}
                    iconPosition={'left'}
                    onChange={({ target: { value } }) => onChange(value)}
                    type={type}
                    placeholder={`${title}...`}
                    autoComplete={autoComplete}
                    value={value}
                />
            </Form.Group>
        )
    }

    return (
        <Card style={{width: '95%'}}>

        <div style={{ width: '80%' }}>

            <TitleText style={{fontSize: '3.2rem'}}> Admin</TitleText>
            
            <SubtitleText>Here you may create and delete new Employees or Admin users.</SubtitleText>
            <br />
            <br />
            {error && renderErrorAlert()}
            {success && renderSuccessAlert()}
            <h2>Create</h2>
            <Form
                style={{ width: '80%' }}
                onSubmit={(e) => handleCreateUser(e)}
            >
                <Form.Row style={{ width: '85%' }}>
                    <UsernameInput
                        containerStyle={{
                            display: 'flex',
                            width: '50%',
                            flexDirection: 'column',
                        }}
                        onChange={(text) => setEmail(text)}
                        value={email}
                    />
                    {renderInput({
                        // input row for password
                        title: 'Password',
                        autoComplete: 'password',
                        icon: 'lock',
                        onChange: setPassword,
                        value: password,
                    })}
                </Form.Row>
                <Form.Row
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '85%',
                    }}
                >
                    {renderInput({
                        // input row for first name
                        title: 'First Name',
                        icon:'pencil alternate',
                        onChange: setFirstName,
                        value: firstName,
                    })}
                    {renderInput({
                        // input row for last name
                        title: 'Last Name',
                        icon:'pencil alternate',
                        onChange: setLastName,
                        value: lastName,
                    })}
                </Form.Row>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '50%',
                    }}
                >
                    <Form.Label>User Type</Form.Label>
                    <Button.Group toggle={true}>
                        <Button
                        // button to set the user to an employee
                            type='button'
                            onClick={() => setIsEmployee(true)}
                            positive={isEmployee}
                        >
                            Employee
                        </Button>
                        <Button.Or />
                        <Button
                        // button to set the new user to an admin
                            type='button'
                            onClick={() => setIsEmployee(false)}
                            positive={!isEmployee}
                        >
                            Admin
                        </Button>
                    </Button.Group>
                    <PrimaryButton disabled={loading || error} type='submit'>
                        Create User
                    </PrimaryButton>
                </div>
            </Form>
            <hr height={2} fill={'black'} />
            <h2>Delete</h2>
            <Form
                style={{ width: '80%' }}
                onSubmit={(e) => handleDeleteUser(e)}
            >
                <UsernameInput
                // user input to delet the user
                    containerStyle={{
                        display: 'flex',
                        width: '42%',
                        flexDirection: 'column',
                    }}
                    onChange={(text) => setDeleteEmail(text)}
                    value={deleteEmail}
                />
                <PrimaryButton disabled={loading || error} type='submit'>
                    Delete User
                </PrimaryButton>
            </Form>
        </div>
        </Card>
    )
}
