import React, { Component } from 'react';

export default class Public extends Component {
    state = {
        message: ""
    }
    componentDidMount() {
        fetch("/public").then((res) => { 
            return res.json();
        })
        .then((res) => {            
            this.setState({message: res.message});            
        })
        .catch((err) => {
            this.setState({message: err.message});            
        });
    }
    render() {
        return (
            <>
            <h1>Public</h1>            
            <p>{this.state.message}</p>
            </>
        )
    }
}
