import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/Schedule.css';
import { Swatch, Color } from '../Styles/StyledComponents';
import { HuePicker } from 'react-color';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
moment.locale('en');
const localizer = momentLocalizer(moment);
const DraggableCalendar = withDragAndDrop(Calendar)
export default function Schedule(props) {
	const [ myEventsList, setMyEventsList ] = useState([]);
	const [ colorPicked, setColorPicked ] = useState('red');
	const [ displayColorPicker, setDisplayColorPicker ] = useState(false);
	
	var blackOutYear = [2020, 2020]
	var blackOutMonth = [1, 1]
	var blackOutDay = [27, 28]

	//useEffect => what to do after the component is rendered
	useEffect(() => {
		//calling setMyEventsList to set hardcoded list
		setMyEventsList([
			{ title: 'Employee 1', start: new Date(2020, 1, 23, 10), end: new Date(2020, 1, 23, 18), color: '#fc0373' },
			{ title: 'Employee 3', start: new Date(2020, 1, 25, 10), end: new Date(2020, 1, 25, 16), color: '#18fc03' }
		]);

	}, []);

	const handleSelect = ({ start, end }) => {
		const title = window.prompt('New Event name');
		if (title) {
			
			//Adjusted portion for blackout days
			var x
			var count = 0
			for(x in blackOutYear)
			{
				if((start.getFullYear() === blackOutYear[x] && start.getMonth() === blackOutMonth[x] && start.getDate() === blackOutDay[x]) && (end.getFullYear() === blackOutYear[x] && end.getMonth() === blackOutMonth[x] && end.getDate() === blackOutDay[x]) )
				{
					count++
				}
			}

			if(count === 0)
			{
				setMyEventsList([ ...myEventsList, { title, start, end, color: colorPicked && colorPicked.hex } ]);
			}
			else
			{
				alert("Event not able to be set during this time.")
			}
		}
	};

	const handleColorChangeComplete = (color, event) =>
		setColorPicked(color, () => setDisplayColorPicker(!displayColorPicker));

	const Event = ({ event }) => {
		return <p style={{ color: 'yellow' }}>{event.title}</p>;
	};

	const moveEvent = ({event,start,end})=>{	
		let {title,color} = event;
		let tempArr = myEventsList.filter(item => item !== event);
		tempArr.push( { title, start, end, color })
		
		//Added portion for blackout days
		var x
		var count = 0
		for(x in blackOutYear)
		{
			if((start.getFullYear() === blackOutYear[x] && start.getMonth() === blackOutMonth[x] && start.getDate() === blackOutDay[x]) && (end.getFullYear() === blackOutYear[x] && end.getMonth() === blackOutMonth[x] && end.getDate() === blackOutDay[x]) )
			{
				count++
			}
		}

		if(count === 0)
		{
			setMyEventsList(tempArr);
		}
		else
		{
			alert("Event not able to be moved to this time.")
		}

		//setMyEventsList(tempArr);
	}

	const resizeEvent = ( {event,start,end} )=>{
		let index = myEventsList.indexOf(event)
		let {title,color} = event;
		let tempArr = [...myEventsList]
		tempArr[index] = {title, color, start, end}
		setMyEventsList(tempArr);
	}

	const handleDelete = ({event}) =>
	{
		const check = window.confirm('\nDelete this event: Ok - YES, Cancel - NO');
		if(check)
		{
			let deleteSpot = myEventsList.indexOf(event)
			let tempArray = [...myEventsList]
			tempArray.splice(deleteSpot, 1);
			setMyEventsList(tempArray);																																																																						
		}
	}

	//Handles the coloring of blackout days
	const handleBlackoutDate = date => {
		var x
		for(x in blackOutYear)
		{
			if ((date.getFullYear() === blackOutYear[x] && date.getMonth() === blackOutMonth[x] && date.getDate() === blackOutDay[x]))
    		return {
      			className: 'special-day',
				style: {
					border: 'solid 3px ' + ((date.getFullYear() === blackOutYear[x] && date.getMonth() === blackOutMonth[x] && date.getDate() === blackOutDay[x]) ? '#000' : '#000'),
					backgroundColor: '#000'
				},
    		}
		}
	}

	//This is the function I am using to control the addition of new blackout days
	const confirmBlackOutDate = () => {
		blackOutDay.push(document.getElementById("boDay").value)
		blackOutMonth.push(document.getElementById("boMonth").value - 1)
		blackOutYear.push(document.getElementById("boYear").value)
		
		console.log(blackOutYear[2])
		console.log(blackOutMonth[2])
		console.log(blackOutDay[2])
	}

	/*
	const handleBlackoutTime = date => {
		if ((date.getHours() === 1 && date.getMinutes() === 30) || date.getHours() === 2 || date.getHours() === 3 || date.getHours() === 4 || date.getHours() === 5 || date.getHours() === 6 || (date.getHours() === 7 && date.getMinutes() === 30))
    		return {
      			className: 'special-time',
				style: {
					border: 'solid 3px ' + ((date.getHours() === 1 && date.getMinutes() === 30) || date.getHours() === 2 || date.getHours() === 3 || date.getHours() === 4 || date.getHours() === 5 || date.getHours() === 6 || (date.getHours() === 7 && date.getMinutes() === 30) ? '#f00' : '#fff'),
				},
    		}
  		else return {}
	}
	*/

	return (
		<div>
			<h1>Schedule</h1>
			<h3 style={{ color: colorPicked }}>This is some schedule content</h3>
			
			<Swatch onClick={() => setDisplayColorPicker(!displayColorPicker)}>
				<Color color={colorPicked.hex} />
				{displayColorPicker && <HuePicker color={colorPicked} onChange={handleColorChangeComplete} />}
			</Swatch>

			<p>
			Blackout Day In-Progress Build
			</p>

			<label for="boDay">Day:</label>
  			<input type="number" id="boDay" name="boDay"/><br></br>

			<label for="boMonth">Month:</label>
  			<input type="number" id="boMonth" name="boMonth"/><br></br>

			<label for="boYear">Year:</label>
  			<input type="number" id="boYear" name="boYear"/><br></br>

			<button onClick={() => confirmBlackOutDate()}
				type="button">
				Confirm Blackout Day!
			</button>

			<DraggableCalendar
				selectable
				localizer={localizer}
				events={myEventsList}
				views={[ 'month', 'week' ]}
				defaultView={Views.WEEK}
				defaultDate={new Date(2020, 1, 25)}
				onSelectEvent={handleDelete}
				onSelectSlot={handleSelect}
				style={{ height: '80vh', width: '80vw', margin: '10vw' }}
				dayPropGetter={handleBlackoutDate}
				//slotPropGetter={handleBlackoutTime}
				eventPropGetter={(event) => ({
					style: {
						backgroundColor: event.color
					}
				})}
				// titleAccessor={function(e) {
				// 	console.log(e);
				// 	return e.title;
				// }}
				components={{
					event: Event
				}}
				draggableAccessor={event => true}
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
			/>
		</div>
	);
}