import React, { Component } from "react";
import PropTypes from "prop-types";
import PlaidLinkButton from "react-plaid-link-button";
import MaterialTable from "material-table";
import Loading from "./Loading";
import Alert from "./Alert";

class PlaidAcct extends Component {
	state = {
		transactions: null,
		accounts: null,
		user: null,
		acctadded:false,
		acctloaded: false
	};

	componentDidMount() {
		const { accounts, user } = this.props;
		this.refreshAccount(accounts, user);
	}

	refreshAccount(accounts, user) {
		this.props.plaid.getAllTransactions(accounts).then(transactions => {
			this.setState({ transactions, accounts, user });
		});
	}

	handleOnSuccess = (token, metadata) => {
		const { accounts, user } = this.props;
		const plaidData = {
			public_token: token,
			metadata: metadata,
			accounts: accounts,
			user,
		};

		this.props.addAccountProm(plaidData, this.state.user.sub).then(res => {
			console.log("promise res inside Plaidacct: " + JSON.stringify(res, null, 2));
			this.refreshAccount(res.accounts.data, this.state.user);
			this.notify();
		});
	};

	onDeleteClick = id => {
		const { accounts } = this.props;
		const accountData = {
			id: id,
			accounts: accounts,
		};
		this.props.deleteAccount(accountData);
	};

	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
	};

	removeNotification = () => {
		this.setState({ acctadded: false });
	};


	notify = () => {
		this.props.notifyUser(() => {
			console.log("inside notifyUser setting status");
			this.setState({ acctadded: true });
		});
		setTimeout(this.removeNotification, 3000);
	};

	render() {
		const { user, accounts, transactions, acctadded } = this.state;

		let plaidAcctContent;
		if (accounts === null) {
			plaidAcctContent = <Loading />;
		} else if (accounts && accounts.length > 0) {
			let accountItems = accounts.map(account => (
				<li key={account._id} style={{ marginTop: "1rem" }}>
					<button
						style={{ marginRight: "1rem" }}
						onClick={this.onDeleteClick.bind(this, account._id)}
						className="btn btn-small btn-floating waves-effect waves-light hoverable red accent-3"
					>
						<i className="material-icons">delete</i>
					</button>
					<b>{account.institutionName}</b>
				</li>
			));

			const transactionsColumns = [
				{ title: "Account", field: "account" },
				{ title: "Date", field: "date", type: "date", defaultSort: "desc" },
				{ title: "Name", field: "name" },
				{ title: "Amount", field: "amount", type: "numeric" },
				{ title: "Category", field: "category" },
			];

			let transactionsData = [];
			if (transactions && transactions.data.length > 0) {
				transactions.data.forEach(acct => {
					acct.transactions.forEach(tran => {
						transactionsData.push({
							account: acct.accountName,
							date: tran.date,
							category: tran.category[0],
							name: tran.name,
							amount: tran.amount,
						});
					});
				});
			}

			plaidAcctContent = (
				<div className="row">
					<div className="col s12">
						<h4>
							<p className="grey-text text-darken-1">
								<b>Welcome,</b> {user.name.split(" ")[0]}
							</p>
						</h4>
						<h5>
							<b>Linked Accounts</b>
						</h5>
						<p className="grey-text text-darken-1">
							Add or remove your bank accounts below
						</p>
						<ul>{accountItems}</ul>
						<div>
							{acctadded ? (
								<Alert
									heading="Account added"
									message={`"${accounts[accounts.length - 1].institutionName}" has been added to your List.`}
								/>
							) : null}

							<PlaidLinkButton
								buttonProps={{
									className:
										"btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn",
								}}
								plaidLinkProps={{
									clientName: process.env.REACT_APP_PLAID_CLIENT_NAME,
									key: process.env.REACT_APP_PLAID_PUBLIC_KEY,
									env: process.env.REACT_APP_PLAID_ENV,
									product: [process.env.REACT_APP_PLAID_PRODUCTS],
									onSuccess: this.handleOnSuccess,
								}}
								// onScriptLoad={() => this.setState({ acctloaded: true })}
							>
								Add Account
							</PlaidLinkButton>
						</div>
						<hr style={{ marginTop: "2rem", opacity: ".2" }} />
						<h5>
							<b>Transactions</b>
						</h5>
						{!transactions ? (
							<p className="grey-text text-darken-1">
								Fetching transactions...
							</p>
						) : (
							<>
								<p className="grey-text text-darken-1">
									You have <b>{transactionsData.length}</b> transactions from
									your
									<b> {accounts.length}</b> linked
									{accounts.length > 1 ? (
										<span> accounts </span>
									) : (
										<span> account </span>
									)}
									from the past 30 days
								</p>
								<MaterialTable
									columns={transactionsColumns}
									data={transactionsData}
									title="Search Transactions"
								/>
							</>
						)}
					</div>
				</div>
			);
		}
		//return <div className="container">{plaidAcctContent}</div>;
		return <div>{plaidAcctContent}</div>;
	}
}

PlaidAcct.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	getAllTransactions: PropTypes.func.isRequired,
	addAccount: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	accounts: PropTypes.array.isRequired,
	plaid: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
};

export default PlaidAcct;
