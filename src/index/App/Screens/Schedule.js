import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/Schedule.css';
moment.locale('en');
const localizer = momentLocalizer(moment);

export default function Schedule(props) {
	const [ myEventsList, setMyEventsList ] = useState([]);

	//useEffect => what to do after the component is rendered
	useEffect(() => {
		//calling setMyEventsList to set hardcoded list
		setMyEventsList([
			{ title: 'Employee 1', start: new Date(2020, 1, 23, 10), end: new Date(2020, 1, 23, 18) },
			{ title: 'Employee 3', start: new Date(2020, 1, 25, 10), end: new Date(2020, 1, 25, 16) }
		]);
	}, []);
	const handleSelect = ({ start, end }) => {
		const title = window.prompt('New Event name');
		if (title) {
			setMyEventsList([ ...myEventsList, { title, start, end } ]);
		}
	};
	return (
		<div>
			<h1>Schedule</h1>
			<h3>This is some schedule content</h3>
			<Calendar
				selectable
				localizer={localizer}
				events={myEventsList}
				views={[ 'month', 'week' ]}
				defaultView={Views.WEEK}
				defaultDate={new Date(2020, 1, 25)}
				onSelectEvent={(event) => alert(event.title)}
				onSelectSlot={handleSelect}
				style={{ height: '80vh', width: '80vw', margin: '10vw' }}
			/>
		</div>
	);
}
