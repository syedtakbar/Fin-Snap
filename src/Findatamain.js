import React, { Component } from "react";
import PlaidLinkButton from "react-plaid-link-button";
import PropTypes from "prop-types";
import PlaidAcct from "./PlaidAcct";
import Loading from "./Loading";

class FinDataMain extends Component {

	constructor(props) {
		super(props);
		this.auth = this.props.auth;
		this.plaidapi = this.props.plaid;				
	}

	state = {
		profile: null,
		accounts:null,		
		error: "",
	};

	componentDidMount() {
		this.loadUserProfile();		
	}


	componentWillUnmount() {
		localStorage.removeItem("user_sub");
	}

	loadUserProfile = () => {
		this.props.getProfile((profile, error) => {
			const userSub = profile.sub;
			this.setState({ profile, error });
			this.getFinAccounts(userSub);	
			userSub && localStorage.setItem("user_sub",userSub);		
		});

		
	};

	getFinAccounts = (usersub) => {				
		this.props.getAccounts(usersub || localStorage.getItem("user_sub"))
		.then( (accounts) => {			
			//console.log(`accounts response: ${JSON.stringify(accounts)}`);
			this.setState({ accounts});			
		});
	};


	handleOnSuccess = (token, metadata) => {
		const plaidData = {
			public_token: token,
			metadata: metadata,			
			user: this.state.profile
		};

		this.props.addAccountProm(plaidData, this.state.profile.sub).then(res => {
			//console.log("promise res inside FinDataMain: " + JSON.stringify(res, null, 2));
			this.getFinAccounts(this.state.profile.sub);	
		});			
	};


	render() {
		const {profile, accounts} = this.state;
		const { isAuthenticated, login, logout} = this.auth;
		
		let findatamainContent;
		
		if (profile === null) {
			findatamainContent = <Loading />;
		} 
		else if (accounts && accounts.data.length > 0) {
			findatamainContent = (
				<PlaidAcct user={profile} accounts={accounts.data}  {...this.props} />
			);
		} else {
			findatamainContent = (
				<div className="row">
					<div className="col s12 center-align">
						<h4>
							<b>Welcome,</b> {profile.name.split(" ")[0]}
						</h4>
						<p className="flow-text grey-text text-darken-1">
							To get started, link your first bank account below
						</p>
						<div>
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
								onScriptLoad={() => this.setState({ loaded: true })}
							>
								Add Account
							</PlaidLinkButton>
						</div>
						<br/>
						<br/>
						<button
							className="btn btn-large waves-effect waves-light hoverable red accent-3 main-btn"
							onClick={isAuthenticated() ? logout : login}
						>
							{isAuthenticated() ? "Log Out" : "Log In"}
						</button>
					</div>
				</div>
			);			
		}

		return <div className="container">{findatamainContent}</div>;
	}
}

FinDataMain.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	getAccounts: PropTypes.func.isRequired,
	addAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	plaid: PropTypes.object.isRequired,
};

export default FinDataMain;
