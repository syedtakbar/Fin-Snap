import React, { Component } from "react";

export default class Findata extends Component {
	state = {
        findata: [],
        message: ""
	};
	componentDidMount() {
		fetch("/findata", {
            headers : {Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        })
		.then(res => {
			if(res.ok) return res.json();
			throw new Error("network response is not ok.");
		})
		.then(res => {				
			this.setState({ findata: res.findata, message: res.message});
		})
		.catch(err => {
			this.setState({ message: err.message });
		});


		fetch("/admin", {
            headers : {Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        })
		.then(res => {
			if(res.ok) return res.json();
			throw new Error("network response is not ok.");
		})
		.then(res => {				
			this.setState({ message: res.message});
		})
		.catch(err => {
			this.setState({ message: err.message });
		});

	}
	render() {
		return (
			<>
				<h1>Findata</h1>
				<p>{this.state.message}</p>
				<ul>{this.state.findata.map((data) =>  <li key={data.id}> title: {data.title}</li> )}</ul>
			</>
		);
	}
}
