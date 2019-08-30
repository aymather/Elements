import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Home from '../home/Home';
import { loadClients } from '../../actions/clientActions';
import { loadGroups } from '../../actions/groupActions';
import NewClient from '../home/clients/NewClient';
import ClientProfile from '../home/clients/Profile/ClientProfile';

class AllRoutes extends Component {

    componentDidMount(){
        this.props.loadClients();
        this.props.loadGroups();
    }

    render() {
        var routes = (
            <Fragment>
                <Route exact path='/' component={Home} />
                <Route exact path='/new-client' component={NewClient} />
                <Route exact path='/view/:id' component={ClientProfile} />
            </Fragment>
        )
        return (
            <Switch>
                {
                    this.props.isAuthenticated
                    && routes
                }
            </Switch>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated
})

export default connect(
    mapStateToProps, {
        loadClients,
        loadGroups
    }
)(AllRoutes);