import axios from "axios";
import io from "socket.io-client";
const socket = io("/");

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
		const accounts = plaidData.accounts;
		axios
			.post("/api/plaid/accounts/add", plaidData)
			.then(res =>
				accounts ? this.getTransactions(accounts.concat(res.data)) : null
			)
			.catch(err => console.log(err));
	};

	addAccountProm = (plaidData, userSub) => {
		return new Promise((resolve, reject) => {
			//console.log("plaidData:" + JSON.stringify(plaidData, null, 2));
			const accounts = plaidData.accounts;
			axios
				.post("/api/plaid/accounts/add", plaidData)
				.then(res => {
					this.getAccounts(userSub)
					.then((acct) => {
						const tran = accounts ? this.getTransactions(accounts.concat(res.data)) : null;
						//console.log("resolve:" + JSON.stringify({acct,tran}, null, 2));
						resolve({accounts: acct,  tranactions: tran});
					});
	
				})
				.catch(err => reject(console.log(err)));
		});
	};	


	deleteAccount = (plaidData, userSub) => {
		return new Promise((resolve, reject) => {						
			const id = plaidData.id;
			const newAccounts = plaidData.accounts.filter(
				account => account._id !== id
			);
			axios
				.delete(`/api/plaid/accounts/${id}`)
				.then(() => {
					this.getAccounts(userSub)
					.then((acct) => {
						const tran = newAccounts ? this.getTransactions(newAccounts) : null;
						resolve({accounts: acct, tranactions: tran});
					});
				})
				.catch(err => reject(console.log(err)));
		});
	};

	getAccounts = user => {	
		return axios ("/api/plaid/accounts/" + user, {			
			headers: { 			    
				"Authorization": `Bearer ${this.auth.getAccessToken()}` 
			},			
		});
	};

	notifyUser = (cb) => {
		console.log("notifyUser api");
		socket.on("timer", timestamp => {
		  console.log("notifyUser socket on event");
		  cb(null, timestamp);
		});
		socket.emit("notifyUser", 100);
	};
}
