const eventData = ` title
start
end
color
`

export const UserData = `
    _id
    firebaseID
    email
    firstName
    lastName
    preferences {${eventData}}
    shifts {${eventData}}
`
