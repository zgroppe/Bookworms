class Account {
	constructor() {
		
	}

	UpdateEmail(FirebaseID, updatedEMail) {
		 
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

export default new Account()
