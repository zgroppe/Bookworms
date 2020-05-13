import React, { useState, useEffect, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { AddTradeBoardShift } from '../API/Mutations/Shifts'
import { GetUserByID } from '../API/Queries/User'
import {
    Card,
    CardTitle,
    Hyperlink,
    PrimaryButton,
    SubtitleText,
    TextInput,
    TitleText,
} from './../Styles/StyledComponents'
import {GetBlackouts} from './../API/Queries/Blackout'


moment.locale('en')
const localizer = momentLocalizer(moment)
const DraggableCalendar = withDragAndDrop(Calendar)

let blackoutDays = []

export default function Overview(props) {
	
	const [myShifts, setMyShifts] = useState([])
    const [blackoutDates, setBlackoutDates] = useState([])

	let userID = localStorage.getItem('currentUserID')

	const { loading, error, data, refetch, networkStatus} = useQuery(
        GetUserByID,
        {
            variables: { id: userID },
            notifyOnNetworkStatusChange: true
        }
    )

	const {
        loading: loading2,
        error: error2,
        data: data2,
        refetch: refetch2,
        networkStatus: netStat2,
    } = useQuery(GetBlackouts)

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }

    function getDates(startDate, stopDate) {
        var dateArray = new Array()
        var currentDate = startDate
        while (currentDate <= stopDate) {
            dateArray.push(new Date(currentDate))
            currentDate = currentDate.addDays(1)
        }
        return dateArray
    }

	useEffect(() => {
        const onCompleted = data => {
			let temp = []
			data.getUserByID.shifts.forEach(({ start, end, ...rest }) => {
				let startDate = new Date(start)
				let endDate = new Date(end)
				temp.push({ start: startDate, end: endDate, ...rest })
			})
			setMyShifts(temp)
		}
		
		const onCompleted2 = data2 => {
			let temp = []
			//console.log('GOT HERE')
			data2.getBlackouts.forEach(({start, end}) => {
                let startDate = new Date(start)
                let endDate = new Date(end)
                //console.log(startDate, '\n', endDate)
                temp.push({start: startDate, end: endDate})
                //console.log(temp)
            })
            //console.log(temp)

            temp.forEach(({start, end}) => {
                blackoutDays.push(...getDates(start, end))
            })

            setBlackoutDates(temp)
			//console.log(blackoutDates)
		}

        if (!loading2 && !error2) onCompleted2(data2)
        if (!loading && !error) onCompleted(data)
    }, [loading, data, error, loading2, data2, error2])

	const Event = ({ event }) => {
        return <p style={{ color: 'yellow' }}>{event.title}</p>
    }

	const [shiftsToPush] = useMutation(AddTradeBoardShift)
	
	if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( {JSON.stringify(error)}</p>
    if (networkStatus === 4) return <p>Refetching...</p>

    
	//Need to add blackout here!!!
	const handleDrop = (event) => {
        const check = window.confirm(
            '\nDo you want to drop this shift: Ok - YES, Cancel - NO'
        )
        if (check) {
            const isUnableToBeDropped = blackoutDays.some((blackoutDate) => {
                //console.log(typeof blackoutDate, typeof event)
                //console.log(blackoutDate, event.start)
                return blackoutDate.toDateString() === event.start.toDateString() || blackoutDate.toDateString() === event.end.toDateString()
            })

            if(!isUnableToBeDropped)
            {
                shiftsToPush({
                    variables: { userID: userID, shiftID: event._id },
                })
                event.color = 'darkred'
            }
            else
            {
                alert('You are unable to drop your shift on this day.')
            }
        }
    }

	const handleBlackoutDate = (date) => {
        //console.log(blackoutDays)
        for(let i in blackoutDates)
        {
            //console.log(blackoutDates[i].start.toISOString(), '\n', blackoutDates[i].end.toISOString())
            let blackoutStartDate = blackoutDates[i].start
            let blackoutStartDate2 = blackoutDates[i].end

            let arr = getDates(blackoutStartDate, blackoutStartDate2)

            for (let x in arr) {
                if (
                    date.getDate() === arr[x].getDate() &&
                    date.getMonth() === arr[x].getMonth() &&
                    date.getFullYear() === arr[x].getFullYear()
                ) {
                    return {
                        style: {
                            backgroundColor: '#000',
                        },
                    }
                }
            }
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
                }}>Overview</TitleText>
			{/* <button onClick = {() => console.log(tradeBoardShifts)}>
			CLICK ME
			</button> */}
			{/* <p>
				{myShifts.length}
			</p>
			<button onClick={()=>console.log(myShifts)}> text </button> */}
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
				dayPropGetter={handleBlackoutDate}
				eventPropGetter={event => ({
					style: {
						backgroundColor: event.available ? 'darkred' : event.color,
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
		</Card>
	)
}