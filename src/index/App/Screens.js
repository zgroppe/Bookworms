import Login from './Screens/Login'
import Dashboard from './Screens/Dashboard'
import Shiftswap from './Screens/Shiftswap'
// All screens here will become a navbar item and a route
const Screens = [
	{
		name: 'Login',
		path: '/',
		protected: false,
		component: Login,
	},
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
]
export default Screens
