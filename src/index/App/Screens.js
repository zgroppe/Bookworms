import Login from './Screens/Login'
import Dashboard from './Screens/Dashboard'
import Shiftswap from './Screens/Shiftswap'
// All screens here will become a navbar item and a route
const Screens = [
	{
		name: 'Dashboard',
		path: '/dashboard',
		protected: true,
		component: Dashboard,
	},
	{
		name: 'Shift Swap',
		path: '/shiftswap',
		protected: true,
		component: Shiftswap,
	},
	{
		name: 'Logout',
		path: '/',
		protected: false,
		component: Login,
	},
]
export default Screens
