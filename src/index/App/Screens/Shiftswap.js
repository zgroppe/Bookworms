import React, { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { UpdateUsersShifts, AddTradeBoardShift, RemoveTradeBoardShift, AcceptPendingShift, DeclinePendingShift } from '../API/Mutations/Shifts'
import { GetAllUsers, GetUserByID } from '../API/Queries/User'

moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

export default function Shiftswap(props) {
	const [dropList, setDropList] = useState([])
	const [pickUpList, setPickUpList] = useState([])

	let userID = localStorage.getItem('currentUserID')

	useEffect(() => {
        //calling setMyEventsList to set hardcoded list
        setDropList([
            { title: 'Employee 1', start: new Date(2020, 1, 23, 5), end: new Date(2020, 1, 23, 18), color: '#fc0373' },
            { title: 'Employee 3', start: new Date(2020, 1, 25, 10), end: new Date(2020, 1, 25, 16), color: '#18fc03' }
        ]);
	}, []);
	
	const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

	// const { loading, error, data: userData, refetch, networkStatus } = useQuery(__________)
	
	//To be used for getting all users
	// const { loading, error, data, refetch, networkStatus } = useQuery(GetAllUsers)

	//To be used for ensuring user with current ID is an admin
	const { loading: loading2, error: error2, data: data2, refetch: refetch2, networkStatus: networkStatus2 } = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true
        }
    )

	if (loading2) return <p>Loading...</p>
    if (error2) return <p>Error :( {JSON.stringify(error2)}</p>
    if (networkStatus2 === 4) return <p>Refetching...</p>
	
	// const [update, { loading, data, error }] = useMutation(______________, {
    //     onCompleted(data) {
    //     }
	// })
	
	//This would be used in getting all users with shifts that are toBeDropped
	// const getData = () => {
	// 	let usersArr = data.getUsers
	// 	let userShiftsToDrop = []
	// 	usersArr.forEach(({ _id, shifts, firstName }) => {
	// 		shifts.forEach(({ start, end, value, toBeDropped }) => {
	// 			let startDate = new Date(start)
	// 			let endDate = new Date(end)
								
	// 			if(toBeDropped)
	// 			{
	// 				userShiftsToDrop.push({ empID: _id, emp: firstName, startDate, endDate, value: parseInt(value), toBeDropped: toBeDropped })
	// 			}
	// 		})
	// 	})
	// 	setDropList(userShiftsToDrop)
	// }

	const handlePickUp = event => {
        const check = window.confirm(
            '\nDo you want to pickup this shift: Ok - YES, Cancel - NO'
        )
        if (check) {
			let tempArray = [...pickUpList]
			tempArray.push(event)
			setPickUpList(tempArray)
        }
	}
	
	const handleApproval = event => {
        const check = window.confirm(
            '\nDo you want to approve this shift pickup: Ok - YES, Cancel - NO'
        )
        if (check) {
			let approvalSpot = pickUpList.indexOf(event)
			let pickUpSlot = dropList.indexOf(event)

			let tempArray = [...dropList]
			tempArray.splice(pickUpSlot, 1)
			setDropList(tempArray)
			
			let tempArray2 = [...pickUpList]
			tempArray2.splice(approvalSpot, 1)
			setPickUpList(tempArray2)

			console.log('Shift swap has been approved')
			//REASSIGN SHIFT
		}
		else
		{
			let approvalSpot = pickUpList.indexOf(event)
			let tempArray2 = [...pickUpList]
			tempArray2.splice(approvalSpot, 1)
			setPickUpList(tempArray2)
			console.log('Shift was not approved')
		}
    }

	const renderTradeBoard = () => {
		return(
			<DraggableCalendar
				selectable
				localizer={localizer}
				events={dropList}
				views={['month', 'week']}
				defaultView={Views.WEEK}
				defaultDate={new Date(2020, 1, 25)}
				onSelectEvent={handlePickUp}
				//onSelectSlot={handleSelect}
				style={{ height: '80vh', width: '1450px'}}
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
		
		// if(data2.getUserByID.userType !== 'Admin')
		// {
		// 	return(
		// 		<DraggableCalendar
		// 			selectable
		// 			localizer={localizer}
		// 			events={dropList}
		// 			views={['month', 'week']}
		// 			defaultView={Views.WEEK}
		// 			defaultDate={new Date(2020, 1, 25)}
		// 			onSelectEvent={handlePickUp}
		// 			//onSelectSlot={handleSelect}
		// 			style={{ height: '80vh', width: '1450px'}}
		// 			//dayPropGetter={handleBlackoutDate}
		// 			eventPropGetter={event => ({
		// 				style: {
		// 					backgroundColor: event.color,
		// 					alignSelf: 'center',
		// 					alignContent: 'center'
		// 				}
		// 			})}
		// 			slotPropGetter={() => ({
		// 				style: {
		// 					// backgroundColor: 'red',
		// 					// borderColor: 'red'
		// 					border: 'none',
		// 					// display: 'flex',
		// 					alignItems: 'center'
		// 				}
		// 			})}
		// 			// titleAccessor={function(e) {
		// 			// 	console.log(e);
		// 			// 	return e.title;
		// 			// }}
		// 			components={{
		// 				event: Event
		// 			}}
		// 			//draggableAccessor={event => true}
		// 			//onEventDrop={moveEvent}
        //     	/>
		// 	)
		// }
	}

	const renderApprovalBoard = () => {
		if(data2.getUserByID.userType === 'Admin')
		{
			return(
				<DraggableCalendar
					selectable
					localizer={localizer}
					events={pickUpList}
					views={['month', 'week']}
					defaultView={Views.WEEK}
					defaultDate={new Date(2020, 1, 25)}
					onSelectEvent={handleApproval}
					//onSelectSlot={handleSelect}
					style={{ height: '80vh', width: '1450px'}}
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
		<div>
			<h1>Shiftswap</h1>
			{renderTradeBoard()}
			{renderApprovalBoard()}

		</div>



	)
}
