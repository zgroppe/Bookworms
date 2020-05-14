import React from 'react'
import Alert from 'react-bootstrap/Alert'
import { PrimaryButton } from './../Styles/StyledComponents'
export function SuccessAlert(props) {
    const { message, onClose } = props
    return (
        <Alert
            style={{ position: 'absolute', top: '3vh', right: '40vw' }}
            variant='success'
            onClose={onClose}
            dismissible
        >
            <Alert.Heading>{'Success!'}</Alert.Heading>
            <p>{message}</p>
            <hr />

            <div className='d-flex justify-content-end'>
                <PrimaryButton onClick={onClose} variant='outline-success'>
                    Okay
                </PrimaryButton>
            </div>
        </Alert>
    )
}

export function ErrorAlert(props) {
    const { error, onClose } = props
    return (
        <Alert
            style={{ position: 'absolute', top: '3vh', right: '40vw' }}
            variant='danger'
            onClose={onClose}
            dismissible
        >
            <Alert.Heading>{error.title}</Alert.Heading>
            <p>{error.message}</p>
            <hr />

            <div className='d-flex justify-content-end'>
                <PrimaryButton onClick={onClose} variant='outline-success'>
                    Okay
                </PrimaryButton>
            </div>
        </Alert>
    )
}
