class Auth {
	constructor() {
		this.authenticated = false
	}

	login(routeAfterLogin) {
		// TODO add firebase login auth logic
		this.authenticated = true
		routeAfterLogin()
	}

	logout(routeAfterLogout) {
		// TODO add firebase logout logic
		this.authenticated = false
		routeAfterLogout()
	}

	isAuthenticated() {
		return this.authenticated
	}
}

export default new Auth()
