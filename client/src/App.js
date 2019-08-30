import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { connect } from 'react-redux';
import { loadUser } from './actions/authActions';
import { clearErrors } from './actions/errorActions';
import IsLoggedIn from './components/auth/IsLoggedIn';
import NotLoggedIn from './components/auth/NotLoggedIn';

class App extends Component {

    componentDidMount(){
        this.props.clearErrors();
        this.props.loadUser();
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired
    }

    render() {
        console.log(this.props);
        return (
            <Fragment>
                {
                    this.props.user.isAuthenticated
                    ? <IsLoggedIn />
                    : <NotLoggedIn />
                }
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    error: state.error
})

export default connect(
    mapStateToProps, {
        loadUser,
        clearErrors
    }
)(App)
