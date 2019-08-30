import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import ElementsLogo from '../svg/ElementsLogo';
import Logout from './Logout';
import { withRouter } from 'react-router-dom';
import { navigateToRetreatSelector } from '../../actions/retreatActions';

class AppNavbar extends Component {
    
    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    onNavigateToRetreatSelector = () => {
        this.props.navigateToRetreatSelector(this.props.history);
    }

    render() {
        return (
            <Navbar expand='sm' className='mb-5 py-3 px-5' light>
                <NavbarBrand href='/'><ElementsLogo /></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className='ml-auto' navbar>
                        <NavItem>
                            <Logout />
                        </NavItem>
                        <NavItem>
                            <NavLink className='open-sans hover-text-black' onClick={this.onNavigateToRetreatSelector}>Retreats</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default withRouter(connect(
    mapStateToProps, {
        navigateToRetreatSelector
    }
)(AppNavbar));