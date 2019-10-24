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
			<div style={{ height: "75vh" }} className="container valign-wrapper">
				<div className="row">
					<div className="col s12 center-align">
						<img
							src={logo}
							style={{ width: "350px" }}
							className="responsive-img"
							alt="Undraw"
						/>
						<h4 className="flow-text">
							<h3>Fin-Snap</h3>FinTech app using Plaid
						</h4>
						<br />
					</div>
				</div>
			</div>
		);
	}
}
