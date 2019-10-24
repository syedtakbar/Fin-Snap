const plaid = require("plaid");
const router = require("express").Router();

const moment = require("moment");

const Account = require("./../../models/Account");

const client = new plaid.Client(
	process.env.REACT_APP_PLAID_CLIENT_ID,
	process.env.REACT_APP_PLAID_SECRET,
	process.env.REACT_APP_PLAID_PUBLIC_KEY,	
	plaid.environments[process.env.REACT_APP_PLAID_ENV],
	{ version: "2019-05-29", clientApp: process.env.REACT_APP_PLAID_CLIENT_NAME}
);

var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

router.get("/accounts/:id", (req, res) => {	
	//console.log("user: " + JSON.stringify(req.params.id));	
	Account.find({ userSub: req.params.id})
		.then(accounts => res.json(accounts))
		.catch(err => console.log(err));
});

router.post("/accounts/add", (req, res) => {
	PUBLIC_TOKEN = req.body.public_token;
	//console.log(JSON.stringify(req.body, null, 2));
	//console.log("userSub " + req.body.user.sub);
	const userSub = req.body.user.sub;

	const institution = req.body.metadata.institution;
	const { name, institution_id } = institution;

	if (PUBLIC_TOKEN) {
		client
			.exchangePublicToken(PUBLIC_TOKEN)
			.then(exchangeResponse => {
				ACCESS_TOKEN = exchangeResponse.access_token;
				ITEM_ID = exchangeResponse.item_id;

				Account.findOne({
					userSub,
					institutionId: institution_id,
				})
					.then(account => {
						if (account) {
							console.log("Account already exists");
						} else {
							const newAccount = new Account({
								userSub: userSub,
								accessToken: ACCESS_TOKEN,
								itemId: ITEM_ID,
								institutionId: institution_id,
								institutionName: name,
							});

							newAccount.save().then(account => res.json(account));
						}
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}
});

router.delete("/accounts/:id", (req, res) => {
	Account.findById(req.params.id).then(account => {		
		account.remove().then(() => res.json({ success: true }));
	});
});

router.post("/accounts/transactions", (req, res) => {
	const now = moment();
	const today = now.format("YYYY-MM-DD");
	const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");

	let transactions = [];

	const accounts = req.body;

	if (accounts) {
		accounts.forEach(function(account) {
			ACCESS_TOKEN = account.accessToken;
			const institutionName = account.institutionName;

			client
				.getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
				.then(response => {
					transactions.push({
						accountName: institutionName,
						transactions: response.transactions,
					});

					if (transactions.length === accounts.length) {
						res.json(transactions);
					}
				})
				.catch(err => console.log(err));
		});
	}
});

module.exports = router;
