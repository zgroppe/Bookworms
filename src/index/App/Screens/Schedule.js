import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/Schedule.css';
moment.locale('en');
const localizer = momentLocalizer(moment);
let allViews = Object.keys(Views).map((k) => Views[k]);

//Date values are supposed to be one less than the actual day, given that date info is probably held in some kind of array
var myEventsList = [
	{ title: 'Meeting', allDay: false, start: new Date(2020, 1, 23, 2, 22, 0), end: new Date(2020, 1, 24, 2, 22, 0) },
	{ title: 'Meeting', allDay: false, start: new Date(2020, 1, 25, 1, 11, 0), end: new Date(2020, 1, 26, 1, 11, 0) }
];

export default function Schedule(props) {
	return (
		<div>
			<h1>Schedule</h1>
			<h3>This is some schedule content</h3>
			<Calendar
				style={{ height: '80vh', width: '80vw', margin: '10vw' }}
				events={myEventsList}
				views={allViews}
				defaultView={'week'}
				localizer={localizer}
				step={60}
				allDayAccessor={false}
				showMultiDayTimes
				// startAccessor="start"
				// endAccessor="end"
			/>
		</div>
	);
}
