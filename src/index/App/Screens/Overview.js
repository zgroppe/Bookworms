import React, { useState, useEffect, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { AddTradeBoardShift } from '../API/Mutations/Shifts'
import { GetUserByID } from '../API/Queries/User'
import { AuthContext } from './../Components/Auth'

moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

export default function Overview(props) {
    const { user } = useContext(AuthContext)
    const [myShifts, setMyShifts] = useState([])

    useEffect(() => {
        if (user) {
            let temp = []
            user.shifts.forEach(({ title, start, end, color, _id }) => {
                let startDate = new Date(start)
                let endDate = new Date(end)
                temp.push({ title, start: startDate, end: endDate, color, _id })
            })
            setMyShifts(temp)
        }
    }, [user])

    const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

    const [shiftsToPush] = useMutation(AddTradeBoardShift)
    const handleDrop = (event) => {
        const check = window.confirm(
            '\nDo you want to drop this shift: Ok - YES, Cancel - NO'
        )
        if (check) {
            shiftsToPush({
                variables: { userID: user._id, shiftID: event._id },
            })
        }
    }

    return (
        <div>
            <p>{myShifts.length}</p>
            <button onClick={() => console.log(myShifts)}> text </button>
            <DraggableCalendar
                selectable
                localizer={localizer}
                events={myShifts}
                views={['month', 'week']}
                defaultView={Views.WEEK}
                defaultDate={new Date(2020, 2, 30)}
                onSelectEvent={handleDrop}
                //onSelectSlot={handleSelect}
                style={{ height: '80vh', width: '1450px' }}
                //dayPropGetter={handleBlackoutDate}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.color,
                        alignSelf: 'center',
                        alignContent: 'center',
                    },
                })}
                slotPropGetter={() => ({
                    style: {
                        // backgroundColor: 'red',
                        // borderColor: 'red'
                        border: 'none',
                        // display: 'flex',
                        alignItems: 'center',
                    },
                })}
                // titleAccessor={function(e) {
                // 	console.log(e);
                // 	return e.title;
                // }}
                components={{
                    event: Event,
                }}
                //draggableAccessor={event => true}
                //onEventDrop={moveEvent}
            />
        </div>
    )
}
