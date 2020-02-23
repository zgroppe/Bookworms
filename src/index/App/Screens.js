import Login from './Screens/Login'
import Overview from './Screens/Overview'
import Shiftswap from './Screens/Shiftswap'
import Statistics from './Screens/Statistics'
import Schedule from './Screens/Schedule'
import Account from './Screens/Account'
import Settings from './Screens/Settings'
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
		name: 'Settings',
		path: '/settings',
		component: Settings,
	},
	{
		name: 'Logout',
		path: '/',
		component: Login,
	},
]
export default Screens
