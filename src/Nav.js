import React, { Component } from "react";
import {NavLink } from "react-router-dom";

export default class Nav extends Component {

	render() {
		const { isAuthenticated, login, logout, userHasScopes } = this.props.auth;
		return (
			<>
				<nav className="navbar navbar-default navbar-static-top">
					<ul className="nav nav-pills">						
						<li>
							<NavLink to="/" activeClassName="active">
								Home
							</NavLink>
						</li>
						{isAuthenticated() && (
						<li>
							<NavLink to="/profile" activeClassName="active">
								Profile
							</NavLink>
						</li>
						)}
						{isAuthenticated() && (
							<li>
								<NavLink to="/admin" activeClassName="active">
									Admin
								</NavLink>
							</li>
						)}
						{isAuthenticated() && userHasScopes(["read:findata"]) && (
							<li>
								<NavLink to="/findata" activeClassName="active">
									Financials
								</NavLink>
							</li>
						)}
						<li>
							<button onClick={isAuthenticated() ? logout : login}>
								{isAuthenticated() ? "Log Out" : "Log In"}
							</button>
						</li>
					</ul>
				</nav>
			</>
		);
	}
}
