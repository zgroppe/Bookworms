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

        const day = (x) =>
        {
                let usersArr = data.getUsers
                let dayArray = []
                usersArr.forEach(({ _id, preferences, firstName }) => {
                        preferences.forEach(({ start, end, value }) => {
                                let startDate = new Date(start)
                                let endDate = new Date(end)
                                if (startDate.getDay() === x) {
                                        dayArray.push({ empID: _id, emp: firstName, startDate, endDate, value: parseInt(value) })
                                }
                        })

                        // let temp = preferences.filter(({ start }) => {
                        //         let startDate = new Date(start)
                        //         return startDate.getDay() === 0
                        // })
                        // sundayArray = [...sundayArray].concat(temp)
                        // //console.log('done', _id);

                });
                ////console.log('***Day:', x, '***')
                ////console.log('Big List of Those Potentially Available: \n', dayArray);


                //HERE IS THE COOL PART

                //result should look like this
                /*
                
                
                */
                let dayHours = [...Array(24).keys()]
                let dayResult = []                        
                let startSaved = 0

                dayHours.forEach((hour, index) => {
                        if (hour >= 7) {
                                //console.log('Hour:', hour);
                                let filteredEmployees = dayArray.filter(({ startDate, endDate, value }) => {
                                        return (startDate.getHours() <= hour && endDate.getHours() > hour + 1 && value !== -100 && Number.isInteger(value))
                                })
                                //this is the available employee in the 'hour' and SOMEHOW ITS SORTED THANKS JAVASCRIPT
                                //console.log('First Filter:\n', filteredEmployees)

                                //filter the available employee with the highest value only
                                let max = -1
                                filteredEmployees.forEach(({ value }) => {
                                        if (value > max) max = value
                                })
                                filteredEmployees = filteredEmployees.filter(({ value }) => value === max)
                                //console.log('Second Filter:\n', filteredEmployees)

                                //Now we are getting random employee from the highest value (filtered above)
                                if (filteredEmployees.length === 1 && startSaved >= 7) console.log('Hours exceeded')
                                else if (filteredEmployees.length === 1 && startSaved < 7 && weeklyMax[filteredEmployees[0].empID] < 20) {
                                        dayResult.push({ shiftTime: hour, assigned: filteredEmployees[0] })
                                        startSaved++
                                        console.log('Goes here because of 1')
                                        //console.log('Current hours:', startSaved)
                                        console.log('Day:', x, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                                        if(weeklyMax[filteredEmployees[0].empID]) weeklyMax[filteredEmployees[0].empID]++
                                        else weeklyMax[filteredEmployees[0].empID] = 1
                                }
                                else if (filteredEmployees.length === 0) console.log('No one available at hour:', hour, 'due to no one available') //sundayResult.push('DO IT YOURSELF') 
                                else {

                                        // sundayArray.push({ empID: _id, emp: firstName, startDate, endDate, value: parseInt(value) })
                                        let isSet = false
                                        //Check if further availability throughout the day
                                        if(dayResult.length !== 0)
                                        {
                                                filteredEmployees.forEach((item, idx) => {
                                                        //if the prev hour was him/her then set it again
                                                        if (dayResult[index - 8].assigned.empID === item.empID && startSaved < 7 && weeklyMax[item.empID] < 20) {
                                                                ////console.log('MATCH BEFORE for this hour:', hour, 'pushing', item.emp);
                                                                dayResult.push({ shiftTime: hour, assigned: filteredEmployees[idx] })
                                                                console.log('Goes here because of previous match')
                                                                console.log('Day:', x, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                                                                isSet = true
                                                                startSaved++
                                                                if(weeklyMax[item.empID]) weeklyMax[item.empID]++
                                                        }
                                                })
                                        }
                                        //WIP
                                        if (!isSet) {
                                                //if the previous employee cant work anymore then we set a new employee to work that
                                                // has the most potential hours
                                                startSaved = 0
                                                let greatest = 0
                                                let least = 12
                                                let chosenEmp = null
                                                filteredEmployees.forEach((item, idx) => {
                                                        if(!weeklyMax[item.empID]) weeklyMax[item.empID] = 1
                                                                 
                                                        console.log('Oh no no no')

                                                        if (item.endDate.getHours() > greatest && weeklyMax[item.empID] < least && weeklyMax[item.empID] < 20){
                                                                greatest = item.endDate.getHours()
                                                                least =  weeklyMax[item.empID]
                                                                chosenEmp = item
                                                                console.log('1',chosenEmp)
                                                        }
                                                        else
                                                        {
                                                                //Maybe remove them from the weeklyMax pool/scheduled list
                                                                weeklyMax[item.empID]--
                                                        }

                                                })
                                                console.log(chosenEmp)
                                                if(chosenEmp !== null) 
                                                {
                                                        dayResult.push({ shiftTime: hour, assigned: chosenEmp })
                                                        weeklyMax[chosenEmp.empID]++
                                                        console.log('Goes here because of random (David), but really most potential hours')
                                                        console.log('Day:', x, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                                                }
                                                else
                                                {
                                                        console.log('2. No one is available at hour:', hour, 'due to hours exceeded')
                                                }
                                                //dayResult.push({ shiftTime: hour, assigned: chosenEmp })
                                                //console.log('2', chosenEmp)
                                                //if(weeklyMax[chosenEmp.empID]) weeklyMax[chosenEmp.empID]++
                                                //console.log('Goes here because of random (David), but really most potential hours')
                                                //console.log('Day:', x, 'Chosen person for the hour ', hour, ' shift: \n', dayResult[dayResult.length - 1])
                                                // if(weeklyMax[filteredEmployees[0].empID]) weeklyMax[filteredEmployees[0].empID]++
                                                // else weeklyMax[filteredEmployees[0].empID] = 1
                                                ////console.log('Who in there now')
                                                ////console.log(dayResult)
                                                // let item = { shiftTime: hour, assigned: filteredEmployees[Math.floor(Math.random() * filteredEmployees.length)] }
                                                // sundayResult.push(item)
                                                ////console.log('DOESNT MATCH for this hour:', hour, 'pushing', item.assigned.emp);
                                        }

                                }

                        }

                })
                //console.log('Day:', x, 'Big list \n', dayResult);
                console.log(weeklyMax)
                //simplify the sundayArray result
                let dayFinalResult = []
                let pass = false
                let hoursSaved
                let newObj

                let certainDay = 29
                let certainMonth = 2

                if(x <= 2)
                {
                        certainDay = certainDay + x
                }
                else
                {
                        certainDay = 0 + x - 2
                        certainMonth = 3
                }
                
                dayResult.forEach((item, index) => {
                        if (index === dayResult.length - 1) {
                                // newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, hoursSaved, 0, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime + 1, 0, 0) }
                                // dayFinalResult.push(newObj)
                                if (!pass) {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, item.shiftTime, 0, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                }
                                else {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, hoursSaved, 0, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                        pass = false
                                }
                        }
                        else if (item.assigned.empID !== dayResult[index + 1].assigned.empID) {

                                if (!pass) {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, item.shiftTime, 0, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                }
                                else {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, certainMonth, certainDay, hoursSaved, 0, 0), end: new Date(2020, certainMonth, certainDay, item.shiftTime + 1, 0, 0) }
                                        dayFinalResult.push(newObj)
                                        pass = false
                                }

                        }
                        else if ((index !== 0 && item.assigned.empID !== dayResult[index - 1].assigned.empID) || (index === 0 && item.assigned.empID === dayResult[index + 1].assigned.empID)) {
                                hoursSaved = item.shiftTime
                                pass = true
                        }
                })
                //console.log('Day:', x, 'Condensed list \n', dayFinalResult)
                console.log('If you have ANY questions, ask David. Probably his fault. ;) HAHAHAHAHAHAHA')
                return dayFinalResult
        }

        const autoPopulate = () => {
                // //console.log(data.getUsers);
        
                let days = [...Array(7).keys()]
                let weekResult = []
                
                days.forEach((x) => {
                        weekResult = weekResult.concat(day(x))
                })

                {
                /*
                let usersArr = data.getUsers
                let sundayArray = []
                usersArr.forEach(({ _id, preferences, firstName }) => {
                        preferences.forEach(({ start, end, value }) => {
                                let startDate = new Date(start)
                                let endDate = new Date(end)
                                if (startDate.getDay() === 0) { //if its sunday
                                        sundayArray.push({ empID: _id, emp: firstName, startDate, endDate, value: parseInt(value) })
                                }
                        })

                        // let temp = preferences.filter(({ start }) => {
                        //         let startDate = new Date(start)
                        //         return startDate.getDay() === 0
                        // })
                        // sundayArray = [...sundayArray].concat(temp)
                        // //console.log('done', _id);

                });
                //console.log(sundayArray);


                //HERE IS THE COOL PART

               
                let sundayHours = [...Array(24).keys()]
                let sundayResult = []
                sundayHours.forEach((hour, index) => {
                        if (hour >= 7) {
                                //console.log('for this hour:', hour, 'in index', index);
                                let filteredEmployees = sundayArray.filter(({ startDate, endDate, value }) => {
                                        return (startDate.getHours() <= hour && endDate.getHours() > hour + 1 && value !== -100 && Number.isInteger(value))
                                })
                                //this is the available employee in the 'hour' and SOMEHOW ITS SORTED THANKS JAVASCRIPT
                                //console.log(filteredEmployees)

                                //filter the available employee with the highest value only
                                let max = -1
                                filteredEmployees.forEach(({ value }) => {
                                        if (value > max) max = value
                                })
                                filteredEmployees = filteredEmployees.filter(({ value }) => value === max)
                                //console.log(filteredEmployees)

                                //Now we are getting random employee from the highest value (filtered above)
                                if (filteredEmployees.length === 1) sundayResult.push({ shiftTime: hour, assigned: filteredEmployees[0] })
                                else if (filteredEmployees.length === 0) //console.log('a') //sundayResult.push('DO IT YOURSELF')
                                else {

                                        // sundayArray.push({ empID: _id, emp: firstName, startDate, endDate, value: parseInt(value) })
                                        let isSet = false
                                        //Check if further availability throughout the day
                                        filteredEmployees.forEach((item, idx) => {
                                                //if the prev hour was him/her then set it again
                                                if (index !== 0 && sundayResult[index - 8].assigned.empID === item.empID) {
                                                        //console.log('MATCH BEFORE for this hour:', hour, 'pushing', item.emp);
                                                        sundayResult.push({ shiftTime: hour, assigned: filteredEmployees[idx] })
                                                        isSet = true
                                                }
                                        })
                                        //WIP
                                        if (!isSet) {
                                                //if the previous employee cant work anymore then we set a new employee to work that
                                                // has the most potential hours
                                                let greatest = 0
                                                let chosenEmp = null
                                                filteredEmployees.forEach((item, idx) => {
                                                        if (item.endDate.getHours() > greatest) {
                                                                greatest = item.endDate.getHours()
                                                                chosenEmp = item
                                                        }

                                                })
                                                sundayResult.push({ shiftTime: hour, assigned: chosenEmp })

                                                // let item = { shiftTime: hour, assigned: filteredEmployees[Math.floor(Math.random() * filteredEmployees.length)] }
                                                // sundayResult.push(item)
                                                // //console.log('DOESNT MATCH for this hour:', hour, 'pushing', item.assigned.emp);
                                        }

                                }

                        }

                })
                //console.log(sundayResult);

                //simplify the sundayArray result
                let sundayFinalResult = []
                let pass = false
                let hoursSaved
                let newObj
                sundayResult.forEach((item, index) => {
                        if (index === sundayResult.length - 1) {
                                newObj = { title: item.assigned.emp, start: new Date(2020, 2, 29, hoursSaved, 0, 0), end: new Date(2020, 2, 29, item.shiftTime + 1, 0, 0) }
                                sundayFinalResult.push(newObj)
                        }
                        else if (item.assigned.empID !== sundayResult[index + 1].assigned.empID) {

                                if (!pass) {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, 2, 29, item.shiftTime, 0, 0), end: new Date(2020, 2, 29, item.shiftTime + 1, 0, 0) }
                                        sundayFinalResult.push(newObj)
                                }
                                else {
                                        newObj = { title: item.assigned.emp, start: new Date(2020, 2, 29, hoursSaved, 0, 0), end: new Date(2020, 2, 29, item.shiftTime + 1, 0, 0) }
                                        sundayFinalResult.push(newObj)
                                        pass = false
                                }

                        }
                        else if ((index !== 0 && item.assigned.empID !== sundayResult[index - 1].assigned.empID) || (index === 0 && item.assigned.empID === sundayResult[index + 1].assigned.empID)) {
                                hoursSaved = item.shiftTime
                                pass = true
                        }
                })
                //console.log(sundayFinalResult)
                return sundayFinalResult
                */
                }

                //console.log('Week:', dayResult)
                return weekResult
        }

        const { loading, error, data, refetch, networkStatus } = useQuery(GetAllUsers)

        return <PrimaryButton onClick={() => props.todo(autoPopulate())}>auto</PrimaryButton>
}