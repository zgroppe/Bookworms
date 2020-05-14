import React, { memo } from 'react'
import {
    Calendar as BigCalendar,
    momentLocalizer,
    Views,
} from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(BigCalendar)

//Function handling the creation of calendars used on different pages
function Calendar(props) {
    const {
        events = [],
        onSelectEvent = (event) => console.log({ event }),
        ...rest
    } = props
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
            defaultDate={new Date()}
            onSelectEvent={onSelectEvent}
            style={{ height: '80vh', width: '90%' }}
            eventPropGetter={(event) => ({
                style: {
                    backgroundColor: event.available
                        ? 'darkred'
                        : event.myShift
                        ? 'green'
                        : event.color,
                    alignSelf: 'center',
                    alignContent: 'center',
                },
            })}
            slotPropGetter={() => ({
                style: {
                    border: 'none',
                    alignItems: 'center',
                },
            })}
            components={{
                event: Event,
            }}
            {...rest}
        />
    )
}
const MyCalendar = memo(Calendar, (prev, next) => {
    return false
})

// const MyCalendar = debounceRender(Calendar, 10000, { leading: false })

export default MyCalendar
