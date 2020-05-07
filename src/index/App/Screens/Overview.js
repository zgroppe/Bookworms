import React, {useState, useEffect} from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import {AddTradeBoardShift} from '../API/Mutations/Shifts'
import { GetUserByID } from '../API/Queries/User'

moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

export default function Overview(props) {
	
	const [myShifts, setMyShifts] = useState([])

	let userID = localStorage.getItem('currentUserID')

	const { loading, error, data, refetch, networkStatus} = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true
        }
	)

	useEffect(() => {
        const onCompleted = data => {
			let temp = []
			data.getUserByID.shifts.forEach(({ title, start, end, color, _id }) => {
				let startDate = new Date(start)
				let endDate = new Date(end)
				temp.push({ title, start: startDate, end: endDate, color, _id })
			})
			setMyShifts(temp)
        }
        if (!loading && !error) onCompleted(data)
    }, [loading, data, error])

	const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
	}

	const [shiftsToPush] = useMutation(AddTradeBoardShift)
	
	if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( {JSON.stringify(error)}</p>
    if (networkStatus === 4) return <p>Refetching...</p>

	const handleDrop = (event) => {
        const check = window.confirm(
            '\nDo you want to drop this shift: Ok - YES, Cancel - NO'
        )
        if (check) {
			shiftsToPush({ variables: { userID: userID, shiftID: event._id } })
        }
    }

	return (
		<div>
			<p>
				{myShifts.length}
			</p>
			<button onClick={()=>console.log(myShifts)}> text </button>
			<DraggableCalendar
				selectable
				localizer={localizer}
				events={myShifts}
				views={['month', 'week']}
				defaultView={Views.WEEK}
				defaultDate={new Date(2020, 2, 30)}
				onSelectEvent={handleDrop}
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
		</div>
	)
}
