import React, { Component } from "react";

export default class Admin extends Component {
	state = {
		message: "",
	};
	componentDidMount() {
		fetch("/admin", {
            headers : {Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        })
			.then(res => {
				if(res.ok) return res.json();
				throw new Error("network response is not ok.");
			})
			.then(res => {				
				this.setState({ message: res.message });
			})
			.catch(err => {
				this.setState({ message: err.message });
			});
	}
	render() {
		return (
			<>
				<h1>Admin</h1>
				<p>{this.state.message}</p>
			</>
		);
	}
}
