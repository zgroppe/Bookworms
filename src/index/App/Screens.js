import Login from './Screens/Login'
import Dashboard from './Screens/Dashboard'
import Shiftswap from './Screens/Shiftswap'
// All screens here will become a navbar item and a route
const Screens = [
	{
		name: 'Dashboard',
		path: '/dashboard',
		component: Dashboard,
	},
	{
		name: 'Shift Swap',
		path: '/shiftswap',
		component: Shiftswap,
	},
	{
		name: 'Logout',
		path: '/',
		component: Login,
	},
]
export default Screens
