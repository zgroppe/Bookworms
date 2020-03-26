import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/Schedule.css';
import { Swatch, Color } from '../Styles/StyledComponents';
import { HuePicker } from 'react-color';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { MdDirectionsWalk } from 'react-icons/md';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
moment.locale('en');
const options = [{value:-100,label:"In-Class",color: "darkred"}, {value:-1,label:"Unpreferred",color:"red"}, {value:0,label:"Neutral",color: "grey"}, {value:1,label:"Preferred",color: "green"}]
const localizer = momentLocalizer(moment);
const DraggableCalendar = withDragAndDrop(Calendar);
export default function Schedule(props) {
	const [ myEventsList, setMyEventsList ] = useState([]);
	const [ myPreferencesList, setMyPreferencesList] = useState([]);
	const [ colorPicked, setColorPicked ] = useState('red');
	const [ displayColorPicker, setDisplayColorPicker ] = useState(false);
	const [ blackoutStart, setBlackoutStart ] = useState('');
	const [ blackoutEnd, setBlackoutEnd ] = useState('');
	const [ dropdownValue, setDropdownValue] = useState(options[1]);

	var blackOutYear = [2020, 2020];
	var blackOutMonth = [1, 1];
	var blackOutDay = [27, 28];

	//useEffect => what to do after the component is rendered
	useEffect(() => {
		//calling setMyEventsList to set hardcoded list
		setMyEventsList([
			{ title: 'Employee 1', start: new Date(2020, 1, 23, 5), end: new Date(2020, 1, 23, 18), color: '#fc0373' },
			{ title: 'Employee 3', start: new Date(2020, 1, 25, 10), end: new Date(2020, 1, 25, 16), color: '#18fc03' }
		]);
	}, []);

	const handleSelect = ({ start, end }) => {
		console.log(myEventsList);

		const title = window.prompt('New Event name');
		if (title) {
			//Adjusted portion for blackout days
			var x;
			var count = 0;
			for (x in blackOutYear) {
				if (
					start.getFullYear() === blackOutYear[x] &&
					start.getMonth() === blackOutMonth[x] &&
					start.getDate() === blackOutDay[x] &&
					(end.getFullYear() === blackOutYear[x] &&
						end.getMonth() === blackOutMonth[x] &&
						end.getDate() === blackOutDay[x])
				) {
					count++;
				}
			}

			if (count === 0) {
				setMyEventsList([...myEventsList, { title, start, end, color: colorPicked && colorPicked.hex }]);
			} else {
				alert('Event not able to be set during this time.');
			}
		}
	};

	const handleSelectPreference = ({ start, end }) => {
		
		let color = "green"

		if(dropdownValue.value == -1) color = "red"
		else if(dropdownValue.value == 0) color = "grey"
		else if(dropdownValue.value == -100) color = "darkred"
		
		setMyPreferencesList([...myPreferencesList, { title: dropdownValue.label, start, end, color}]);
	}

	const handleColorChangeComplete = (color, event) =>
		setColorPicked(color, () => setDisplayColorPicker(!displayColorPicker));

	const Event = ({ event }) => {
		return <p style={{ color: 'yellow' }}>{event.title}</p>;
	};

	const moveEvent = ({ event, start, end }) => {
		let { title, color } = event;
		let tempArr = myEventsList.filter((item) => item !== event);
		tempArr.push({ title, start, end, color });

		//Added portion for blackout days
		var x;
		var count = 0;
		for (x in blackOutYear) {
			if (
				start.getFullYear() === blackOutYear[x] &&
				start.getMonth() === blackOutMonth[x] &&
				start.getDate() === blackOutDay[x] &&
				(end.getFullYear() === blackOutYear[x] &&
					end.getMonth() === blackOutMonth[x] &&
					end.getDate() === blackOutDay[x])
			) {
				count++;
			}
		}

		if (count === 0) {
			setMyEventsList(tempArr);
		} else {
			alert('Event not able to be moved to this time.');
		}

		//setMyEventsList(tempArr);
	};

	const resizeEvent = ({ event, start, end }) => {
		let index = myEventsList.indexOf(event);
		let { title, color } = event;
		let tempArr = [...myEventsList];
		tempArr[index] = { title, color, start, end };
		setMyEventsList(tempArr);
	};

	const handleDelete = ({ event }) => {
		const check = window.confirm('\nDelete this event: Ok - YES, Cancel - NO');
		if (check) {
			let deleteSpot = myEventsList.indexOf(event);
			let tempArray = [...myEventsList];
			tempArray.splice(deleteSpot, 1);
			setMyEventsList(tempArray);
		}
	};

	//Handles the coloring of blackout days
	const handleBlackoutDate = (date) => {
		let blackoutStartDate = new Date(blackoutStart)
		let blackoutStartDate2 = new Date(blackoutEnd)

		Date.prototype.addDays = function (days) {
			var date = new Date(this.valueOf());
			date.setDate(date.getDate() + days);
			return date;
		}

		function getDates(startDate, stopDate) {
			var dateArray = new Array();
			var currentDate = startDate;
			while (currentDate <= stopDate) {
				dateArray.push(new Date(currentDate));
				currentDate = currentDate.addDays(1);
			}
			return dateArray;
		}

		let arr = getDates(blackoutStartDate, blackoutStartDate2)

		for(let x in arr) {
			if (date.getDate() === arr[x].getDate() && date.getMonth() === arr[x].getMonth() && date.getFullYear() === arr[x].getFullYear()) {

				return {
					style: {
						backgroundColor: '#000'
					}
				}
			}
		}
	};

	const renderBlackout = () => {
		const renderDatePicker = (statename, functionName) => {
			return (
				<DatePicker
					selected={statename}
					onSelect={(date) => functionName(date)} //when day is clicked
					minDate={statename === blackoutEnd && blackoutStart}
					maxDate={statename === blackoutStart && blackoutEnd}
				//   onChange={this.handleChange} //only when value has changed
				/>
			);
		};
		return (
			<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', }}>
				<div style={{ display: 'flex' }}>
					<p>start</p>
					{renderDatePicker(blackoutStart, setBlackoutStart)}
				</div>
				<div style={{ display: 'flex' }}>
					<p>end</p>
					{renderDatePicker(blackoutEnd, setBlackoutEnd)}
				</div>
				<p>{blackoutStart && typeof blackoutStart}</p>
			</div>
		);
	};

	let formats = {
		dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
	}

	const movePreference = ({ event, start, end }) => {
		let { title, color } = event;
		let tempArr = myPreferencesList.filter((item) => item !== event);
		tempArr.push({ title, start, end, color });
		setMyPreferencesList(tempArr);
	};

	const resizePreference = ({ event, start, end }) => {
		let index = myPreferencesList.indexOf(event);
		let { title, color } = event;
		let tempArr = [...myPreferencesList];
		tempArr[index] = { title, color, start, end };
		setMyPreferencesList(tempArr);
	};

	const handleDeletePreference = ({ event }) => {
		const check = window.confirm('\nDelete this event: Ok - YES, Cancel - NO');
		if (check) {
			let deleteSpot = myPreferencesList.indexOf(event);
			let tempArray = [...myPreferencesList];
			tempArray.splice(deleteSpot, 1);
			setMyPreferencesList(tempArray);
		}
	};

	return (
		<div>
			<h1>Schedule</h1>
			<h3 style={{ color: colorPicked }}>This is some schedule content</h3>

			<Swatch onClick={() => setDisplayColorPicker(!displayColorPicker)}>
				<Color color={colorPicked.hex} />
				{displayColorPicker && <HuePicker color={colorPicked} onChange={handleColorChangeComplete} />}
			</Swatch>
			{renderBlackout()}

			<DraggableCalendar
				selectable
				localizer={localizer}
				events={myEventsList}
				views={['month', 'week']}
				defaultView={Views.WEEK}
				defaultDate={new Date(2020, 1, 25)}
				onSelectEvent={handleDelete}
				onSelectSlot={handleSelect}
				style={{ height: '80vh', width: '80vw', margin: '10vw' }}
				dayPropGetter={handleBlackoutDate}
				eventPropGetter={(event) => ({
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
				draggableAccessor={(event) => true}
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
			/>

			<p>
				Preferences
			</p>
			
			<Dropdown options={options} onChange={(x) => setDropdownValue(x)} value={dropdownValue} placeholder="Select an option" />

			{/* <p>
				{dropdownValue && dropdownValue.color}
			</p> */}

			<DraggableCalendar //Preferences calendar
				selectable
				localizer={localizer}
				toolbar={false}
				formats={formats}
				events={myPreferencesList}
				defaultView={Views.WEEK}
				onSelectEvent={handleDeletePreference}
				onSelectSlot={handleSelectPreference}
				style={{ height: '80vh', width: '80vw', margin: '10vw' }}
				eventPropGetter={(event) => ({
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
				dayPropGetter={() => ({
					style: {
						// backgroundColor: 'green',
						alignItems: 'flex-start'
						// alignSelf: 'flex-start'
					}
				})}
				// titleAccessor={function(e) {
				// 	console.log(e);
				// 	return e.title;
				// }}
				// components={{
				// 	event: Event
				// }}
				draggableAccessor={(event) => true}
				onEventDrop={movePreference}
				onEventResize={resizePreference}
			/>
		</div>
	);
}
