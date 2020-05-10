import React, { useState } from 'react'
export const AuthContext = React.createContext()
export const AuthProvider = ({ children }) => {
    const [user, setCurrentUser] = useState(null)
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser: (user) => setCurrentUser(user),
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
