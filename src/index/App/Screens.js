import Overview from './Screens/Overview'
import Shiftswap from './Screens/Shiftswap'
import Statistics from './Screens/Statistics'
import Schedule from './Screens/Schedule'
import Account from './Screens/Account'
import Admin from './Screens/Admin'
import Logout from './Screens/Logout'
// All screens here will become a navbar item and a route
const Screens = [
    {
        name: 'Overview',
        path: '/overview',
        component: Overview,
    },
    {
        name: 'Shift Swap',
        path: '/shiftswap',
        component: Shiftswap,
    },
    {
        name: 'Statistics',
        path: '/statistics',
        component: Statistics,
    },
    {
        name: 'Schedule',
        path: '/schedule',
        component: Schedule,
    },
    {
        name: 'Account',
        path: '/account',
        component: Account,
    },
    {
        name: 'Admin',
        path: '/Admin',
        component: Admin,
    },
    {
        name: 'Logout',
        path: '/logout',
        component: Logout,
    },
]
export default Screens
