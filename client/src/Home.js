import React, { Component } from "react";
import logo from "./fin-snap-logo.png";

export default class Home extends Component {
	state = {
		loaded: false
	}

	handleOnSuccess = (token, metadata) => {
		const plaidData = {
			public_token: token,
			metadata: metadata,
		};

		this.props.addAccount(plaidData);
	};


	render() {
		return (
			<div style={{ height: "75vh" , "padding-top": "70px" }} className="container valign-wrapper">
				<div className="row">
					<div className="col s12 center-align">
						<img
							src={logo}
							style={{ width: "350px" }}
							className="responsive-img"
							alt="Undraw"
						/>
						<h4 className="flow-text">
							<b>Fin-Snap</b> is a personal FinTech app created using Plaid
						</h4>
						<br />
					</div>
				</div>
			</div>
		);
	}
}
