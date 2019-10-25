import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";
import PlaidAPI from "./PlaidAPI";

import Callback from "./Callback";
import Admin from "./Admin";
import FinDataMain from "./FinDataMain";

class App extends Component {
	constructor(props) {
		super(props);
		this.auth = new Auth(this.props.history);
		this.plaidapi = new PlaidAPI(this.auth);
	}
	render() {
		return (
			<>
				<Nav auth={this.auth} />
				<div className="body">
					<Route
						path="/"
						exact
						render={props => <Home auth={this.auth} {...props} />}
					/>
					<Route
						path="/callback"
						exact
						render={props => <Callback auth={this.auth} {...props} />}
					/>
					<Route
						path="/profile"
						exact
						render={props =>
							this.auth.isAuthenticated() ? (
								<Profile auth={this.auth} {...props} />
							) : (
								<Redirect to="/" />
								//this.auth.login()
							)
						}
					/>
					<Route
						path="/admin"
						exact
						render={props =>
							this.auth.isAuthenticated() ? (
								<Admin auth={this.auth} {...props} />
							) : (
								this.auth.login()
							)
						}
					/>
					<Route
						path="/findata"
						exact
						render={props =>
							this.auth.isAuthenticated() &&
							this.auth.userHasScopes(["read:findata"]) ? (
								<FinDataMain
									auth={this.auth}
									getProfile={this.auth.getProfile}
									plaid={this.plaidapi}
									logoutUser={this.auth.logout}
									getAccounts={this.plaidapi.getAccounts}
									addAccount={this.plaidapi.addAccount}	
									getAllTransactions={this.plaidapi.getAllTransactions}
									deleteAccount={this.plaidapi.deleteAccount}
									addAccountProm={this.plaidapi.addAccountProm}									
									{...props}
								/>
							) : (
								this.auth.login()
							)
						}
					/>
				</div>
			</>
		);
	}
}

export default App;
