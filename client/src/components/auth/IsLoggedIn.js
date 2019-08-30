import React, { Component } from 'react'
import Navbar from '../navigation/Navbar';

export default class IsLoggedIn extends Component {
    render() {
        return (
            <div>
                <Navbar />
                <h1>Is Logged In</h1>
            </div>
        )
    }
}
