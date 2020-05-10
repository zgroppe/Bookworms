import React, { useContext } from 'react'
import { AuthContext } from './../Components/Auth'
export default function Logout(props) {
    const { setUser } = useContext(AuthContext)
    setUser(null)
    localStorage.clear()
    props.history.push('/')
    return <div></div>
}
