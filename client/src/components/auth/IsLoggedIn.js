import React, { Component } from 'react'
import Navbar from '../navigation/Navbar';
import { connect } from 'react-redux';
import { loadRetreats } from '../../actions/retreatActions';
import Retreats from '../retreats/Retreats';
import Home from '../home/Home';

class IsLoggedIn extends Component {
    componentDidMount(){
        this.props.loadRetreats();
    }

    render() {
        return (
            <div>
                <Navbar />
                { 
                    this.props.retreats.selected_retreat
                    ? <Home />
                    : <Retreats />
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    retreats: state.retreats
})

export default connect(
    mapStateToProps, {
        loadRetreats
    }
)(IsLoggedIn);