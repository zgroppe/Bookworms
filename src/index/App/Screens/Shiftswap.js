import React, { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { UpdateUsersShifts, RemoveTradeBoardShift, AddPendingShift, AcceptPendingShift, DeclinePendingShift } from '../API/Mutations/Shifts'
import { GetAllUsers, GetUserByID } from '../API/Queries/User'
import {
    Card,
    CardTitle,
    Hyperlink,
    PrimaryButton,
    SubtitleText,
    TextInput,
    TitleText,
} from './../Styles/StyledComponents'
import {GetTradeBoardShifts, GetPendingShifts} from '../API/Queries/Shifts'
import { Button } from 'semantic-ui-react'

moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

export default function Shiftswap(props) {
	const [tradeBoardShifts, setTradeBoardShifts] = useState([])
	const [pendingApprovalShifts, setPendingApprovalShifts] = useState([])

	let userID = localStorage.getItem('currentUserID')
	
	const {
        loading: loading,
        error: error,
        data: data,
        refetch: refetch,
        networkStatus: netStat,
	} = useQuery(GetTradeBoardShifts)
	
	const {
        loading: loading3,
        error: error3,
        data: data3,
        refetch: refetch3,
        networkStatus: netStat3,
    } = useQuery(GetPendingShifts)

	const { loading: loading2, error: error2, data: data2, refetch: refetch2, networkStatus: networkStatus2 } = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true
        }
	)
	
	const [shiftsToRemove] = useMutation(RemoveTradeBoardShift)
	const [shiftsToApprove] = useMutation(AddPendingShift)
	const [acceptShift] = useMutation(AcceptPendingShift)
	const [declineShift] = useMutation(DeclinePendingShift)

	useEffect(() => {
        const onCompleted = data => {
			let temp = []
			//console.log('GOT HERE')
			data.getTradeBoardShifts.forEach(({ title, start, end, color, _id , full_user}) => {
				let startDate = new Date(start)
				let endDate = new Date(end)
				temp.push({ title, start: startDate, end: endDate, color, _id, full_user })
			})
			setTradeBoardShifts(temp)
			//console.log(tradeBoardShifts)
		}
		const onCompleted2 = data3 => {
			let temp2 = []
			data3.getPendingShifts.forEach(({ title, start, end, color, _id, fromUserID, toUserId}) => {
				let startDate = new Date(start)
				let endDate = new Date(end)
				temp2.push({ title, start: startDate, end: endDate, color, _id, fromUserID, toUserId })
			})
			setPendingApprovalShifts(temp2)
			//console.log(pendingApprovalShifts)
        }
		if (!loading && !error) onCompleted(data)
		if (!loading3 && !error3) onCompleted2(data3)
    }, [loading, data, error, loading3, data3, error3])

	const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

	// const { loading, error, data: userData, refetch, networkStatus } = useQuery(__________)
	
	//To be used for getting all users
	// const { loading, error, data, refetch, networkStatus } = useQuery(GetAllUsers)

	//To be used for ensuring user with current ID is an admin
	
	if (loading2) return <p>Loading...</p>
    if (error2) return <p>Error :( {JSON.stringify(error2)}</p>
    if (networkStatus2 === 4) return <p>Refetching...</p>

	const handlePickUp = event => {
        const check = window.confirm(
            '\nDo you want to pickup this shift: Ok - YES, Cancel - NO'
        )
        if (check) {
			shiftsToApprove({ variables: { toUserID: userID, fromUserID: event.full_user._id, shiftID: event._id } })
        }
	}
	
	const handleApproval = event => {
        const check = window.confirm(
            '\nDo you want to approve this shift pickup: Ok - YES, Cancel - NO'
        )
        if (check) {
			acceptShift({ variables: { shiftID: event._id } })
			shiftsToRemove({ variables: {shiftID: event._id, userID: event.fromUserID }})			
			console.log('Shift swap has been approved')
		}
		else
		{
			declineShift({ variables: { shiftID: event._id } })
			console.log('Shift was not approved')
		}
    }

	const renderTradeBoard = () => {	
		if(data2.getUserByID.userType !== 'Admin')
		{
			return(
				<DraggableCalendar
					selectable
					localizer={localizer}
					events={tradeBoardShifts}
					views={['month', 'week']}
					defaultView={Views.WEEK}
					defaultDate={new Date(2020, 1, 25)}
					onSelectEvent={handlePickUp}
					//onSelectSlot={handleSelect}
					style={{ align: 'center', height: '80vh', width: '1450px'}}
					//dayPropGetter={handleBlackoutDate}
					eventPropGetter={event => ({
						style: {
							backgroundColor: event.color,
							alignSelf: 'center',
							alignContent: 'center'
						}
					})}
					slotPropGetter={() => ({
						style: {
							// backgroundColor: 'red',
							// borderColor: 'red'
							border: 'none',
							// display: 'flex',
							alignItems: 'center'
						}
					})}
					// titleAccessor={function(e) {
					// 	console.log(e);
					// 	return e.title;
					// }}
					components={{
						event: Event
					}}
					//draggableAccessor={event => true}
					//onEventDrop={moveEvent}
				/>
			)
		}
	}

	const renderApprovalBoard = () => {
		if(data2.getUserByID.userType === 'Admin')
		{
			return(
				<DraggableCalendar
					selectable
					localizer={localizer}
					events={pendingApprovalShifts}
					views={['month', 'week']}
					defaultView={Views.WEEK}
					defaultDate={new Date(2020, 1, 25)}
					onSelectEvent={handleApproval}
					//onSelectSlot={handleSelect}
					style={{ align: 'center', height: '80vh', width: '1450px'}}
					//dayPropGetter={handleBlackoutDate}
					eventPropGetter={event => ({
						style: {
							backgroundColor: event.color,
							alignSelf: 'center',
							alignContent: 'center'
						}
					})}
					slotPropGetter={() => ({
						style: {
							// backgroundColor: 'red',
							// borderColor: 'red'
							border: 'none',
							// display: 'flex',
							alignItems: 'center'
						}
					})}
					// titleAccessor={function(e) {
					// 	console.log(e);
					// 	return e.title;
					// }}
					components={{
						event: Event
					}}
					//draggableAccessor={event => true}
					//onEventDrop={moveEvent}
				/>
			)
		}
	}

	return (
		<Card style={{
            width: '1500px' }}>
		<div>
			<TitleText style={{
                    textAlign: 'left',
                    position: 'flex',
                    fontSize: '48px',
                    //clear:'left'
                }}>Shiftswap</TitleText>
			{/* <button onClick = {() => console.log(tradeBoardShifts)}>
			CLICK ME
			</button> */}
			{renderTradeBoard()}
			{renderApprovalBoard()}
		</div>
		</Card>


	)
}
