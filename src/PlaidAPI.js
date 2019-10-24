import axios from "axios";

export default class PlaidAPI {
	constructor(auth) {
		this.auth = auth;
	}

	getAllTransactions = plaidData => {
		return axios.post("/api/plaid/accounts/transactions",
		plaidData);
	};

	getTransactions = plaidData => {
		axios.post("/api/plaid/accounts/transactions", 	plaidData);
	};

	addAccount = plaidData => {
		console.log("plaidData:" + JSON.stringify(plaidData, null, 2));
		const accounts = plaidData.accounts;
		axios
			.post("/api/plaid/accounts/add", plaidData)
			.then(res =>
				accounts ? this.getTransactions(accounts.concat(res.data)) : null
			)
			.catch(err => console.log(err));
	};

	deleteAccount = plaidData => {
		if (window.confirm("Are you sure you want to remove this account?")) {
			const id = plaidData.id;
			const newAccounts = plaidData.accounts.filter(
				account => account._id !== id
			);
			axios
				.delete(`/api/plaid/accounts/${id}`)
				.then(newAccounts ? this.getTransactions(newAccounts) : null)
				.catch(err => console.log(err));
		}
	};

	getAccounts = user => {	
		return axios ("/api/plaid/accounts/" + user, {			
			headers: { 			    
				"Authorization": `Bearer ${this.auth.getAccessToken()}` 
			},			
		});
	};
}
