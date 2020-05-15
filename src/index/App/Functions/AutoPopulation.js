import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { GetAllUsers } from '../API/Queries/User'
import { PrimaryButton } from './../Styles/StyledComponents'
import { SCHEDULE } from './AutoPopConstant'

//Check for what value the weekly max value is going to be using local storage
const checkWeekly = () => {
        if(localStorage.getItem('currentWeeklyMax') && localStorage.getItem('currentWeeklyMax') > 0)
        {
                return localStorage.getItem('currentWeeklyMax')
        }
        else
        {
                return 20
        }
}

//Check for what value the daily max value is going to be using local storage
const checkDaily = () => {
        if(localStorage.getItem('currentDailyMax') && localStorage.getItem('currentDailyMax') > 0)
        {
                return localStorage.getItem('currentDailyMax')
        }
        else
        {
                return 7
        }
}

//Global variables for use later in this program
let WEEKLYMAX = 0
let DAILYMAX = 0
let weeklyMax = {}
let dailyMax = {}

export default function AutoPopulation(props) {

        //Assign value of that of the weekly and daily max values
        WEEKLYMAX = checkWeekly()
        DAILYMAX = checkDaily()
        
        //Day function, going through each day of the week for auto population
        const day = (itemList, indexArray) => {

                //Function figuring out if someone is available to work
                const canWork = (id) => {
                        if (dailyMax[id] < DAILYMAX && weeklyMax[id] < WEEKLYMAX) {
                                dailyMax[id]++
                                weeklyMax[id]++
                                return true
                        }
                        else return false
                }

                //Setup vars for our following daily operations
                let usersArr = data.getUsers
                let dayArray = []

                //Get user preferences
                usersArr.forEach(({ _id, preferences, firstName }) => {

                        dailyMax[_id] = 0
                        if (!(_id in weeklyMax)) weeklyMax[_id] = 0

                        //Assign user preferences to larger day array
                        preferences.forEach(({ start, end, value }) => {
                                let startDate = new Date(start)
                                let endDate = new Date(end)
                                if (startDate.getDay() === indexArray) {
                                        dayArray.push({ empID: _id, emp: firstName, startDate, endDate, value: parseInt(value) })
                                }
                        })

                });

                let dayResult = []

                //Loop going through all of those available and assigning them to a time slot
                itemList.forEach(({ time, slot }, index) => {
                        let hour = parseInt(time.split(':')[0])
                        let minute = parseInt(time.split(':')[1])

                        //Filter employees once based off of preferred starting time being before or at the same time of shift start,
                        //preferred end time is at or later than shift end, and preference being checked is not where the employee is in class
                        let filteredEmployees = dayArray.filter(({ startDate, endDate, value }) => {
                                return (startDate.getHours() <= hour && endDate.getHours() >= hour + 1 && value !== -100 && Number.isInteger(value))
                        })

                        let max = -1

                        //If else handling the assigning of employees to shifts part
                        //First if handles if no employee is available at the time
                        if (filteredEmployees.length === 0) {
                                dayResult.push({ shiftTime: { hour, minute }, assigned: [] })
                        }
                        //This else handles in the case there are more than one available
                        else {
                                //Filter finding the employee
                                filteredEmployees.forEach(({ value }) => {
                                        if (value > max) max = value
                                })

                                //Filters to focus on those with the highest preference value
                                let highValueFilteredEmployees = filteredEmployees.filter(({ value }) => value === max)

                                //If statement handling assigning to shifts but now focusing on the employees with the highest preference value
                                //if preferred available employees count is less than slot
                                if (highValueFilteredEmployees.length < slot) {
                                        let taken = []
                                        let random

                                        if (max >= 0) {
                                                filteredEmployees = filteredEmployees.filter(({ value }) => {
                                                        return max === 1 ? value === 0 : value === -1
                                                })
                                        }

                                        //Loop going through if there are multiple employees available, and picking the best one
                                        while (highValueFilteredEmployees.length < slot && filteredEmployees.length !== 0) {
                                                random = Math.floor(Math.random() * filteredEmployees.length)

                                                if (!taken.includes(random)) {
                                                        highValueFilteredEmployees.push(filteredEmployees[random])
                                                        filteredEmployees.splice(random, 1)
                                                        taken.push(random)
                                                }

                                        }
                                }

                                //Further focus on that of the ending set of shifts
                                let dayResultObj = { shiftTime: { hour, minute }, assigned: [] }

                                //If else handling search for available employee to assign a shift to
                                //Handling if no one is available
                                if (highValueFilteredEmployees === 0) {
                                        dayResult.push('NOTHING HERE')
                                }
                                //Handles if there are less available then the time slot allows
                                else if (highValueFilteredEmployees.length <= slot) {

                                        //Assigns just who is available
                                        highValueFilteredEmployees.forEach((item) => {
                                                if (canWork(item.empID)) {
                                                        dayResultObj.assigned.push(item)
                                                }
                                        })
                                        dayResult.push(dayResultObj)
                                }
                                //Else handling if there are multiple employees to choose from
                                else if (highValueFilteredEmployees.length > slot) {

                                        let prevEmployees = []
                        
                                        //Finds out who was previously assigned
                                        if (index !== 0) {
                                                dayResult[index - 1].assigned.forEach(({ empID }) => {
                                                        prevEmployees.push(empID)
                                                })
                                        }

                                        //Finds out if previously assigned persons are available at current slot too
                                        highValueFilteredEmployees.forEach((item, highValIndex) => {
                                                if (prevEmployees.includes(item.empID) && dayResultObj.assigned.length < slot && canWork(item.empID)) {
                                                        dayResultObj.assigned.push(item)
                                                        highValueFilteredEmployees.splice(highValIndex, 1)
                                                }
                                        })
                                        
                                        //Finds out other people that can work that weren't already scheduled previously
                                        highValueFilteredEmployees.forEach((item, highValIndex) => {
                                                if (dayResultObj.assigned.length < slot && canWork(item.empID)) {
                                                        dayResultObj.assigned.push(item)
                                                }
                                        })

                                        dayResult.push(dayResultObj)
                                }
                        }
                })

                //Vars to be used in finalizing shifts to be sent to the admin schedule
                let dayFinalResult = []
                let newObj
                let certainDay = 29
                let certainMonth = 2

                //This if handles the adjustment of our date to push
                if (indexArray <= 2) {
                        certainDay = certainDay + indexArray
                }
                else {
                        certainDay = 0 + indexArray - 2
                        certainMonth = 3
                }

                //Loop to go throughout all assigned shifts, and making them into larger blocks in the case one person works
                //several consecutive shifts
                dayResult.forEach(({ assigned, shiftTime }, index) => {
                        assigned.forEach((employee) => {
                                //Vars to be used in putting multiple shifts into one larger shift block
                                let noLongerScheduled = false
                                let iter = 1
                                let theirStartHour = 0
                                let theirStartMinute
                                let theirEndHour
                                let theirEndMinute
                                let stillGoing = false

                                //if they are not scheduled the prev hour
                                if (index === 0) {
                                        //Loop continuing to look for if a shift for a specific individual has ended
                                        while (!noLongerScheduled) {

                                                if (index + iter <= dayResult.length - 1 && dayResult[index + iter].assigned.includes(employee)) {
                                                        console.log('Keep looking')
                                                        if (iter === 1) {
                                                                theirStartHour = shiftTime.hour
                                                                theirStartMinute = shiftTime.minute
                                                        }
                                                        stillGoing = true
                                                }
                                                else {
                                                        noLongerScheduled = true
                                                        theirEndHour = shiftTime.hour + iter
                                                        theirEndMinute = shiftTime.minute
                                                }
                                                iter++
                                        }
                                        
                                        //If else handling the end of a consecutive shift
                                        if(stillGoing) {
                                                newObj = { id: employee.empID, title: employee.emp, start: new Date(2020, certainMonth, certainDay, theirStartHour, theirStartMinute, 0), end: new Date(2020, certainMonth, certainDay, theirEndHour, 0, 0) }
                                        }
                                        else {
                                                newObj = { id: employee.empID, title: employee.emp, start: new Date(2020, certainMonth, certainDay, shiftTime.hour, shiftTime.minute, 0), end: new Date(2020, certainMonth, certainDay, theirEndHour, 0, 0) }
                                        }

                                        dayFinalResult.push(newObj)
                                }
                                //Else handing, like before, in the case if shifts for anyone continue for an extended period of time
                                else if (!dayResult[index - 1].assigned.includes(employee)) {
                                        while (!noLongerScheduled) {

                                                if (index + iter <= dayResult.length - 1 && dayResult[index + iter].assigned.includes(employee)) {
                                                        console.log('Keep looking')
                                                        if (iter === 1) {
                                                                theirStartHour = shiftTime.hour
                                                                theirStartMinute = shiftTime.minute
                                                        }
                                                        stillGoing = true
                                                }
                                                else {
                                                        noLongerScheduled = true
                                                        theirEndHour = shiftTime.hour + iter
                                                        theirEndMinute = shiftTime.minute
                                                }
                                                iter++
                                        }
                                        
                                        //If else handling the end of a consecutive shift
                                        if(stillGoing) {
                                                newObj = { id: employee.empID, title: employee.emp, start: new Date(2020, certainMonth, certainDay, theirStartHour, theirStartMinute, 0), end: new Date(2020, certainMonth, certainDay, theirEndHour, 0, 0) }
                                        }
                                        else {
                                                newObj = { id: employee.empID, title: employee.emp, start: new Date(2020, certainMonth, certainDay, shiftTime.hour, shiftTime.minute, 0), end: new Date(2020, certainMonth, certainDay, theirEndHour, 0, 0) }
                                        }
                                        
                                        dayFinalResult.push(newObj)
                                }
                        })
                })

                return dayFinalResult
        }

        //Function handling the iterating process that goes through 
        const autoPopulate = () => {
                
                let weekResult = []

                //Loop going through all the days and times provided to auto populate the shifts on the schedule page
                SCHEDULE.forEach((item, index) => {
                        weekResult = weekResult.concat(day(item, index))
                })

                return weekResult
        }

        //Database query declaration for the get all users query
        const { loading, error, data, refetch, networkStatus } = useQuery(GetAllUsers)

        //Returned button on the schedule page
        return <PrimaryButton onClick={() => props.todo(autoPopulate())}>Auto Populate</PrimaryButton>
}