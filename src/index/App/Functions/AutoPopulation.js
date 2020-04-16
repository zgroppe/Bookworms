import { useMutation, useQuery } from '@apollo/react-hooks'
import { GetAllUsers } from '../API/Queries/User'
import React from 'react'
import {
        Card,
        Hyperlink,
        PrimaryButton,
        SubtitleText,
        TextInput,
        TitleText
} from './../Styles/StyledComponents'
import { SCHEDULE } from './AutoPopConstant'
const WEEKLYMAX = 20
const DAILYMAX = 7

/*
        Per Shift
*/
//InClass - -100
//Unpreferred - -1
//Neutral - -0
//Preferred - 1

/*
        Per Employee
*/
//Employee value - [0-4]


/*
        Special Case
*/
//inBetween Class && Preferred - 2
//inBetween Class && Neutral - 1

let weeklyMax = {}

export default function AutoPopulation(props) {

        const day = (itemList, indexArray) => {
                console.log('----------DAY-----------', indexArray)
                let usersArr = data.getUsers
                let dayArray = []

                //GETTING USERS' PREFERENCES ON THAT DAY 0-6
                usersArr.forEach(({ _id, preferences, firstName }) => {
                        preferences.forEach(({ start, end, value }) => {
                                let startDate = new Date(start)
                                let endDate = new Date(end)
                                if (startDate.getDay() === indexArray) {
                                        dayArray.push({ empID: _id, emp: firstName, startDate, endDate, value: parseInt(value) })
                                }
                        })

                });


                let dayHours = [...Array(24).keys()]
                let dayResult = []
                let startSaved = 0

                itemList.forEach(({ time, slot }, index) => {
                        console.log('----HOUR----', time)
                        let hour = parseInt(time.split(':')[0])
                        let minute = parseInt(time.split(':')[1])
                        //console.log('Hour:', hour);
                        let filteredEmployees = dayArray.filter(({ startDate, endDate, value }) => {
                                return (startDate.getHours() <= hour && endDate.getHours() > hour + 1 && value !== -100 && Number.isInteger(value))
                        })
                        //this is the available employee in the 'hour' and SOMEHOW ITS SORTED THANKS JAVASCRIPT
                        //console.log('First Filter:\n', filteredEmployees)

                        //filter the available employee with the highest value only
                        let max = -1
                        console.log('FE', filteredEmployees);

                        if (filteredEmployees.length === 0) {
                                dayResult.push({ shiftTime: { hour, minute }, assigned: [] })
                        }
                        else {
                                filteredEmployees.forEach(({ value }) => {
                                        if (value > max) max = value
                                })
                                let highValueFilteredEmployees = filteredEmployees.filter(({ value }) => value === max)

                                console.log('HVFE', highValueFilteredEmployees);
                                if (highValueFilteredEmployees.length < slot) {
                                        //if preferred available employees count is less than slot
                                        let taken = []
                                        let random

                                        if (max >= 0) {
                                                console.log('HEREBRO MAX >=0');
                                                filteredEmployees = filteredEmployees.filter(({ value }) => {
                                                        return max === 1 ? value === 0 : value === -1
                                                })
                                        }


                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        //INFINITE LOOPS BE AWARE
                                        while (highValueFilteredEmployees.length < slot) {
                                                console.log('HEREBRO');



                                                random = Math.floor(Math.random() * filteredEmployees.length)

                                                if (!taken.includes(random)) {
                                                        console.log('HEREBRO PUSHING');
                                                        highValueFilteredEmployees.push(filteredEmployees[random])
                                                        filteredEmployees.splice()
                                                        taken.push(random)
                                                }

                                        }
                                        console.log('FINISHBRO');

                                }


                                // filteredEmployees = filteredEmployees.filter(({ value }) => value === max)

                                //console.log('Second Filter:\n', filteredEmployees)


                                let dayResultObj = { shiftTime: { hour, minute }, assigned: [] }
                                if (highValueFilteredEmployees === 0) {
                                        // dayResultObj.assigned.push('NOTHING HERE')
                                        dayResult.push('NOTHING HERE')
                                }
                                else if (highValueFilteredEmployees.length <= slot) {
                                        //  startSaved >= DAILYMAX

                                        highValueFilteredEmployees.forEach((item) => {
                                                dayResultObj.assigned.push(item)
                                        })
                                        dayResult.push(dayResultObj)
                                }

                                else if (highValueFilteredEmployees.length > slot) {
                                        let prevEmployees = []
                                        // if (dayResult[index - 1].assigned.empID === item.empID && startSaved < DAILYMAX && weeklyMax[item.empID] < WEEKLYMAX) {
                                        //                                 ////console.log('MATCH BEFORE for this hour:', hour, 'pushing', item.emp);
                                        //                                 dayResult.push({ shiftTime: { hour, minute }, assigned: highValueFilteredEmployees[idx] })
                                        //                                 console.log('Goes here because of previous match')
                                        //                                 console.log('Day:', indexArray, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                                        //                                 isSet = true
                                        //                                 startSaved++
                                        //                                 weeklyMax[item.empID]++
                                        //                         }

                                        // console.log('INDEX', index)
                                        // console.log(dayResult[index - 1])
                                        if (index !== 0) {
                                                dayResult[index - 1].assigned.forEach(({ empID }) => {
                                                        prevEmployees.push(empID)
                                                })
                                        }




                                        highValueFilteredEmployees.forEach((item, highValIndex) => {
                                                if (prevEmployees.includes(item.empID)) {
                                                        dayResultObj.assigned.push(item)
                                                        highValueFilteredEmployees.splice(highValIndex, 1)
                                                }
                                        })

                                        highValueFilteredEmployees.forEach((item, highValIndex) => {
                                                //push the best available time
                                                while (dayResultObj.assigned.length < slot)
                                                        dayResultObj.assigned.push(item)
                                        })

                                        // console.log('INDEX1', index)
                                        dayResult.push(dayResultObj)


                                }

                                console.log('DAY RESULT', dayResultObj)
                        }



                        //if only 1 available and that hours exceed 8 then error
                        // if (highValueFilteredEmployees.length === 1 && startSaved >= DAILYMAX) console.log('Hours exceeded')

                        // //if only 1 available and that hours has not exceeded 8 then set
                        // else if (highValueFilteredEmployees.length === 1 && startSaved < DAILYMAX && weeklyMax[highValueFilteredEmployees[0].empID] < WEEKLYMAX) {
                        //         dayResult.push({ shiftTime: { hour, minute }, assigned: highValueFilteredEmployees[0] })
                        //         startSaved++
                        //         console.log('Goes here because of 1')
                        //         //console.log('Current hours:', startSaved)
                        //         console.log('Day:', indexArray, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                        //         if (weeklyMax[highValueFilteredEmployees[0].empID]) weeklyMax[highValueFilteredEmployees[0].empID]++
                        //         else weeklyMax[highValueFilteredEmployees[0].empID] = 1
                        // }

                        // //if no employees are available then error
                        // else if (highValueFilteredEmployees.length === 0) console.log('No one available at hour:', hour, 'due to no one available') //sundayResult.push('DO IT YOURSELF') 
                        // else {

                        //         //isSet = repetitive employee to be assigned by default is false
                        //         let isSet = false
                        //         //if not the first time of the day
                        //         if (dayResult.length !== 0) {
                        //                 highValueFilteredEmployees.forEach((item, idx) => {
                        //                         //if the prev hour was him/her then set it again
                        //                         if (dayResult[index - 1].assigned.empID === item.empID && startSaved < DAILYMAX && weeklyMax[item.empID] < WEEKLYMAX) {
                        //                                 ////console.log('MATCH BEFORE for this hour:', hour, 'pushing', item.emp);
                        //                                 dayResult.push({ shiftTime: { hour, minute }, assigned: highValueFilteredEmployees[idx] })
                        //                                 console.log('Goes here because of previous match')
                        //                                 console.log('Day:', indexArray, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                        //                                 isSet = true
                        //                                 startSaved++
                        //                                 weeklyMax[item.empID]++
                        //                         }
                        //                 })
                        //         }
                        //         //WIP
                        //         if (!isSet) {
                        //                 //if the previous employee cant work anymore then we set a new employee to work that
                        //                 // has the most potential hours
                        //                 startSaved = 0
                        //                 let greatest = 0
                        //                 let least = 12
                        //                 let chosenEmp = null
                        //                 highValueFilteredEmployees.forEach((item, idx) => {
                        //                         if (!weeklyMax[item.empID]) weeklyMax[item.empID] = 0

                        //                         console.log('Oh no no no')

                        //                         if (item.endDate.getHours() > greatest && weeklyMax[item.empID] < least && weeklyMax[item.empID] < WEEKLYMAX) {
                        //                                 greatest = item.endDate.getHours()
                        //                                 least = weeklyMax[item.empID]
                        //                                 chosenEmp = item
                        //                                 console.log('1', chosenEmp)
                        //                         }

                        //                 })
                        //                 // console.log(chosenEmp)
                        //                 if (chosenEmp !== null) {
                        //                         dayResult.push({ shiftTime: { hour, minute }, assigned: chosenEmp })
                        //                         weeklyMax[chosenEmp.empID]++
                        //                         console.log('Goes here because of random (David), but really most potential hours')
                        //                         console.log('Day:', indexArray, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                        //                 }
                        //                 else {
                        //                         console.log('2. No one is available at hour:', hour, 'due to hours exceeded')
                        //                 }

                        //         }

                        // }



                })
                //console.log('Day:', indexArray, 'Big list \n', dayResult);
                console.log(weeklyMax)
                //simplify the sundayArray result
                let dayFinalResult = []
                let pass = false
                let hoursSaved
                let minutesSaved
                let newObj

                let certainDay = 29
                let certainMonth = 2

                if (indexArray <= 2) {
                        certainDay = certainDay + indexArray
                }
                else {
                        certainDay = 0 + indexArray - 2
                        certainMonth = 3
                }

                dayResult.forEach((item, index) => {
                        if (index === dayResult.length - 1) {
                                // newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, hoursSaved, 0, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime + 1, 0, 0) }
                                // dayFinalResult.push(newObj)
                                if (!pass) {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, item.shiftTime.hour, item.shiftTime.minute, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime.hour + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                }
                                else {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, hoursSaved, minutesSaved, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime.hour + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                        pass = false
                                }
                        }
                        else if (item.assigned.empID !== dayResult[index + 1].assigned.empID) {

                                if (!pass) {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, item.shiftTime.hour, item.shiftTime.minute, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime.hour + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                }
                                else {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, hoursSaved, minutesSaved, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime.hour + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                        pass = false
                                }

                        }
                        else if ((index !== 0 && item.assigned.empID !== dayResult[index - 1].assigned.empID) || (index === 0 && item.assigned.empID === dayResult[index + 1].assigned.empID)) {

                                //make it one block
                                hoursSaved = item.shiftTime.hour
                                minutesSaved = item.shiftTime.minute
                                pass = true
                        }
                })
                //console.log('Day:', indexArray, 'Condensed list \n', dayFinalResult)
                console.log('If you have ANY questions, ask David. Probably his fault. ;) HAHAHAHAHAHAHA')
                return dayFinalResult
        }

        const autoPopulate = () => {


                // let days = [...Array(7).keys()]
                let weekResult = []

                // days.forEach((indexArray) => {
                //         weekResult = weekResult.concat(day(indexArray))
                // })

                SCHEDULE.forEach((item, index) => {
                        weekResult = weekResult.concat(day(item, index))
                })

                return weekResult
        }

        const { loading, error, data, refetch, networkStatus } = useQuery(GetAllUsers)

        return <PrimaryButton onClick={() => props.todo(autoPopulate())}>auto</PrimaryButton>
}