import React, { useState, useEffect, useContext } from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import {
    RemoveTradeBoardShift,
    AddPendingShift,
    AcceptPendingShift,
    DeclinePendingShift,
} from '../API/Mutations/Shifts'
import { Card, TitleText, PrimaryButton } from './../Styles/StyledComponents'
import { GetTradeBoardShifts, GetPendingShifts } from '../API/Queries/Shifts'
import { AuthContext } from './../Components/Auth'
import { SuccessAlert, ErrorAlert } from './../Components/Alerts'
import LoadingSpinner from './../Components/LoadingSpinner'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

export default function Shiftswap() {
    const [tradeBoardShifts, setTradeBoardShifts] = useState([])
    const [pendingApprovalShifts, setPendingApprovalShifts] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [information, setInformation] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(false)
    const { user } = useContext(AuthContext)

    // Function to get the trade board shifts, called for an employee
    const [getTradeBoardShifts, { loading: loadingTradeBoard }] = useLazyQuery(
        GetTradeBoardShifts,
        {
            onCompleted({ getTradeBoardShifts }) {
                const formattedShifts = getTradeBoardShifts.map((shift) => {
                    const { start, end } = shift
                    let startDate = new Date(start)
                    let endDate = new Date(end)
                    return { ...shift, start: startDate, end: endDate }
                })
                setTradeBoardShifts(formattedShifts)
            },
            onError({ message }) {
                setError({
                    title: 'Unable To Load Trade Board Shifts!',
                    message,
                })
            },
        }
    )

    // Function to get pending shifts, used for admin
    const [getPendingShifts, { loading: loadingPending }] = useLazyQuery(
        GetPendingShifts,
        {
            onCompleted({ getPendingShifts }) {
                const formattedShifts = getPendingShifts.map((shift) => {
                    const { start, end } = shift
                    let startDate = new Date(start)
                    let endDate = new Date(end)
                    return { ...shift, start: startDate, end: endDate }
                })
                setPendingApprovalShifts(formattedShifts)
            },
            onError({ message }) {
                setError({
                    title: 'Error Loading Pending Shifts To Swap!',
                    message,
                })
            },
        }
    )

    // Function to remove a trade board shift, used for employee
    const [
        removeTradeBoardShift,
        { loading: removeTradeBoardShiftLoading },
    ] = useMutation(RemoveTradeBoardShift, {
        onError({ message }) {
            setError({ title: 'Error Removing Shift!', message })
        },
        onCompleted({ removeTradeBoardShift }) {
            if (removeTradeBoardShift) {
                const temp = [...tradeBoardShifts]
                temp.splice(
                    temp.findIndex(({ _id }) => removeTradeBoardShift == _id),
                    1
                )
                setTradeBoardShifts(temp)
            }
        },
    })

    // Function to add a pending shift, used for employee
    const [addPendingShift, { loading: addPendingShiftLoading }] = useMutation(
        AddPendingShift,
        {
            onError({ message }) {
                setError({ title: 'Error Adding Shift!', message })
            },
        }
    )

    // Function to accept a pending shift, used for admin
    const [
        acceptPendingShift,
        { loading: acceptPendingShiftLoading },
    ] = useMutation(AcceptPendingShift, {
        onError({ message }) {
            setError({ title: 'Error Accepting Shift Swap!', message })
        },
        onCompleted({ acceptPendingShift }) {
            if (acceptPendingShift) {
                const temp = [...acceptPendingShift]
                temp.splice(
                    temp.findIndex(({ _id }) => acceptPendingShift == _id),
                    1
                )
                setPendingApprovalShifts(temp)
            }
        },
    })

    // Function to decline a pending shift, used for admin
    const [
        declinePendingShift,
        { loading: declinePendingShiftLoading },
    ] = useMutation(DeclinePendingShift, {
        onError({ message }) {
            setError({ title: 'Error Declining Shift Swap!', message })
        },
        onCompleted({ declinePendingShift }) {
            if (declinePendingShift) {
                const temp = [...declinePendingShift]
                temp.splice(
                    temp.findIndex(({ _id }) => declinePendingShift == _id),
                    1
                )
                setPendingApprovalShifts(temp)
            }
        },
    })

    // When the screen loads, make the correct database call based on userType
    useEffect(() => {
        if (user.userType === 'Admin') getPendingShifts()
        else if (user.userType === 'Employee') getTradeBoardShifts()
    }, [getPendingShifts, getTradeBoardShifts, user])

    // If anything is loading, set it as loading
    // If anything is not loading, set it as not loading
    useEffect(() => {
        if (
            loadingTradeBoard ||
            loadingPending ||
            removeTradeBoardShiftLoading ||
            addPendingShiftLoading ||
            acceptPendingShiftLoading ||
            declinePendingShiftLoading
        )
            setLoading(true)
        else setLoading(false)
    }, [
        loadingTradeBoard,
        loadingPending,
        removeTradeBoardShiftLoading,
        addPendingShiftLoading,
        acceptPendingShiftLoading,
        declinePendingShiftLoading,
    ])

    // If the event is clicked, set the information popup accordingly
    useEffect(() => {
        if (selectedEvent && !information) {
            if (user.userType === 'Admin')
                setInformation({
                    title: 'Confirm Shift Swap',
                    message: 'Do you approve of this shift being picked up?',
                })
            else
                setInformation({
                    title: 'Pick Up Shift',
                    message: 'Do you want to pickup this shift?',
                })
        }
    }, [information, selectedEvent, user.userType])

    // Function to render the correct calendar based on userType
    const renderCalendar = () => {
        let events = []
        if (user.userType === 'Admin') events = pendingApprovalShifts
        else if (user.userType === 'Employee') events = tradeBoardShifts

        const Event = ({ event }) => {
            return <p style={{ color: 'yellow' }}>{event.title}</p>
        }
        return (
            <DraggableCalendar
                selectable
                localizer={localizer}
                events={events}
                views={['month', 'week']}
                defaultView={Views.WEEK}
                defaultDate={new Date(2020, 1, 25)}
                onSelectEvent={(event) => setSelectedEvent(event)}
                style={{ align: 'center', height: '80vh', width: '1450px' }}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.color,
                        alignSelf: 'center',
                        alignContent: 'center',
                    },
                })}
                slotPropGetter={() => ({
                    style: { border: 'none', alignItems: 'center' },
                })}
                components={{ event: Event }}
            />
        )
    }

    const handlePickupTradeBoard = () => {
        addPendingShift({
            variables: {
                toUserID: user._id,
                fromUserID: selectedEvent.full_user._id,
                shiftID: selectedEvent._id,
            },
        })
        setInformation(false)
        setSelectedEvent(false)
    }

    const handleRemoveTradeBoard = () => {
        removeTradeBoardShift({
            variables: { shiftID: selectedEvent._id, userID: user._id },
        })
        setInformation(false)
        setSelectedEvent(false)
    }

    const handleApprovePending = () => {
        console.log(selectedEvent)

        acceptPendingShift({ variables: { shiftID: selectedEvent._id } })
        setInformation(false)
        setSelectedEvent(false)
    }

    const handleDeclinePending = () => {
        declinePendingShift({ variables: { shiftID: selectedEvent._id } })
        setInformation(false)
        setSelectedEvent(false)
    }

    const renderInformativeAlert = () => {
        let onAccept
        let onDecline
        if (user.userType === 'Admin') {
            onAccept = handleApprovePending
            onDecline = handleDeclinePending
        } else if (user.userType === 'Employee') {
            onAccept = handlePickupTradeBoard
            onDecline = handleRemoveTradeBoard
        }
        return (
            <Alert
                style={{ position: 'absolute', top: '3vh', right: '40vw' }}
                variant='info'
                onClose={() => {
                    setInformation(false)
                    setSelectedEvent(false)
                }}
                dismissible
            >
                <Alert.Heading>{information.title}</Alert.Heading>
                <p>{information.message}</p>
                <hr />
                <div
                    style={{
                        display: 'flex',
                        fliexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        onClick={onAccept}
                        variant='outline-success'
                        style={{
                            height: '4.1vh',
                            width: '30%',
                            marginRight: '5%',
                        }}
                    >
                        Approve
                    </Button>
                    <Button
                        onClick={onDecline}
                        variant='outline-danger'
                        style={{ height: '4vh', width: '30%' }}
                    >
                        Disapprove
                    </Button>
                    <PrimaryButton
                        onClick={() => {
                            setInformation(false)
                            setSelectedEvent(false)
                        }}
                    >
                        Cancel
                    </PrimaryButton>
                </div>
            </Alert>
        )
    }

    return (
        <Card style={{ width: '95%' }}>
            <div>
                <TitleText
                    style={{
                        textAlign: 'left',
                        position: 'flex',
                        fontSize: '3.2rem',
                    }}
                >
                    Shiftswap
                </TitleText>
                {success && (
                    <SuccessAlert
                        message={success}
                        onClose={() => setSuccess(false)}
                    />
                )}
                {error && (
                    <ErrorAlert error={error} onClose={() => setError(false)} />
                )}

                {loading ? <LoadingSpinner /> : renderCalendar()}
                {information && renderInformativeAlert()}
            </div>
        </Card>
    )
}
