import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
export default function UsernameInput(props) {
    const {
        style = {},
        containerStyle = {},
        onChange = (value) => console.log(value),
        as = 'row',
    } = props

    const [appendEmail, setAppendEmail] = useState('@islander.tamucc.edu')

    const handleTextChanged = (text) => {
        if (text.includes('@') && appendEmail !== '') {
            setAppendEmail('')
        } else if (
            !text.includes('@') &&
            appendEmail !== '@islander.tamucc.edu'
        ) {
            setAppendEmail('@islander.tamucc.edu')
        }
        onChange(text)
    }

    return (
        <Form.Group as={as}>
            <Form.Label>Username</Form.Label>
            <InputGroup style={containerStyle}>
                <FormControl
                    placeholder='Username...'
                    aria-label='Username'
                    onChange={({ target: { value } }) =>
                        handleTextChanged(value)
                    }
                    style={style}
                    autoComplete='username'
                    type='text'
                />
                {appendEmail.length > 0 && (
                    <InputGroup.Append>
                        <InputGroup.Text>{appendEmail}</InputGroup.Text>
                    </InputGroup.Append>
                )}
            </InputGroup>
            <Form.Text className='text-muted'>
                We'll never share this email with anyone else.
            </Form.Text>
        </Form.Group>
    )
}
