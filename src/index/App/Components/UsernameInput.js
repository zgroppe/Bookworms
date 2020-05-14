import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Icon, Input } from 'semantic-ui-react'
export default function UsernameInput(props) {
    const {
        containerStyle = { flexDirection: 'column', display: 'flex' },
        onChange = (value) => console.log(value),
        value = '',
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
        <Form.Group style={containerStyle}>
            <Form.Label>Email</Form.Label>
            <div style={{ display: 'contents' }}>
                <Input
                    icon='user outline'
                    iconPosition='left'
                    onChange={({ target: { value } }) =>
                        handleTextChanged(value)
                    }
                    placeholder='Email...'
                    aria-label='Email'
                    autoComplete='username'
                    type='text'
                    value={value}
                />
                {appendEmail.length > 0 && (
                    <InputGroup.Append>
                        <InputGroup.Text>{appendEmail}</InputGroup.Text>
                    </InputGroup.Append>
                )}
            </div>
            <Form.Text className='text-muted'>
                We will never share this email with anyone else.
            </Form.Text>
        </Form.Group>
        // <Form.Group
        //     // as={as}
        //     style={{ flexDirectoin: 'column', display: 'flex' }}
        // >
        //     <Form.Label>Username</Form.Label>
        //     <InputGroup style={containerStyle}>
        //         <Input
        //             icon='user outline'
        //             iconPosition='left'
        //             onChange={({ target: { value } }) =>
        //                 handleTextChanged(value)
        //             }
        //             placeholder='Username...'
        //             aria-label='Username'
        //             style={style}
        //             autoComplete='username'
        //             type='text'
        //         />
        //         {appendEmail.length > 0 && (
        //             <InputGroup.Append>
        //                 <InputGroup.Text>{appendEmail}</InputGroup.Text>
        //             </InputGroup.Append>
        //         )}
        //     </InputGroup>
        //     <Form.Text className='text-muted'>
        //         We'll never share this email with anyone else.
        //     </Form.Text>
        // </Form.Group>
    )
}
