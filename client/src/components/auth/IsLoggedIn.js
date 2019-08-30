import React, { Component, Fragment } from 'react'
import Navbar from '../navigation/Navbar';
import { connect } from 'react-redux';
import { loadRetreats } from '../../actions/retreatActions';
import { withRouter } from 'react-router-dom';
import Retreats from '../retreats/Retreats';
import AllRoutes from '../navigation/AllRoutes';

class IsLoggedIn extends Component {
    componentDidMount(){
        this.props.loadRetreats();
    }

    render() {
        return (
            <Fragment>
                <Navbar />
                { 
                    this.props.retreats.selected_retreat
                    ? <AllRoutes />
                    : <Retreats />
                }
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    retreats: state.retreats
})

export default withRouter(connect(
    mapStateToProps, 
    { loadRetreats }
)(IsLoggedIn));