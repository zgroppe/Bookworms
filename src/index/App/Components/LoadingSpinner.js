import React from 'react'
export default function LoadingSpinner(props) {
    const { style = { height: '80vh' } } = props
    return (
        <div class='ui segment' style={style}>
            <div class='ui active loader'></div>
            <p></p>
        </div>
    )
}
