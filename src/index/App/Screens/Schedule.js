import React from 'react'
import {Calendar, momentLocalizer, Views} from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)
let allViews = Object.keys(Views).map(k => Views[k])
var myEventsList = [{'title': 'Meeting','allDay': false, 'start': new Date(2020, 2, 23, 2, 22, 0), 'end': new Date(2020, 2, 24, 2, 22, 0)}, {'title': 'Meeting','allDay': false, 'start': new Date(2020, 2, 25, 1, 11, 0), 'end': new Date(2020, 2, 26, 1, 11, 0)}]

export default function Schedule(props) {
	return (
		<div>
			<h1>Schedule</h1>
			<h3>This is some schedule content</h3> 
			<Calendar
				events={myEventsList}
				views={allViews}
				localizer={localizer}
				step={60}
				showMultiDayTimes
				startAccessor="start"
				endAccessor="end"
			/>
		</div>
	)
}
