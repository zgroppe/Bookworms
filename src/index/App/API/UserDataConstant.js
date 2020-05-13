const eventData = ` title
start
end
color
value
_id
available
`

export const UserData = `
    _id
    firebaseID
    email
    userType
    firstName
    lastName
    preferences {${eventData}}
    shifts {${eventData}}
`
