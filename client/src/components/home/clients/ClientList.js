import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeClient, loadClientOuraData } from '../../../actions/clientActions';
import { ListGroup } from 'reactstrap';
import ClientListItem from './ClientListItem';
import { Input, Button } from 'reactstrap';
import moment from 'moment';

class ClientList extends Component {

    state = {
        searchText: null,
        loadStatus: false
    }

    componentDidMount(){
        if(!this.state.loadStatus){
            var initialDay = new moment().format('YYYY-MM-DD');
            this.setState({ loadStatus: true }, () => {
                for(let client of this.props.clients.clients){
                    this.props.loadClientOuraData(client.oura_api.oura_access_token, initialDay, client.id);
                }
            })
        }
    }

    handle_removeClient = e => {
        e.preventDefault();

        var ans = window.confirm("Are you sure you want to remove this client along with all their data?");

        if(ans){
            this.props.removeClient(e.target.name);
        };
    }

    get_body = () => {
        if(this.props.clients.clients){
            return this.props.clients.clients.map(client => {
                if(!this.state.searchText || this.state.searchText.length === 0){
                    return (
                        <ClientListItem client={client}
                                        handle_removeClient={this.handle_removeClient}
                                        key={client.id}
                                    />
                    )
                }
                const regex = new RegExp(`^${this.state.searchText}`, 'gi');
                const name = client.firstname + ' ' + client.lastname;

                if(name.match(regex)){
                    return (
                        <ClientListItem client={client}
                                        handle_removeClient={this.handle_removeClient}
                                        key={client.id}
                                    />
                    )
                }
                
                return null;
            })
        }
    }

    searchChange = e => {
        this.setState({ searchText: e.target.value })
    }

    render() {
        return (
            <div>
                <div className='d-flex justify-content-between mt-4 align-items-center'>
                    <Button href='/new-client'
                            color='primary'
                    >Create New Client +</Button>
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search"
                        style={{ float: 'right' }}
                        className='d-inline-block w-25'
                        onChange={this.searchChange}
                    />
                </div>
                <ListGroup className='mt-4'>
                    {this.get_body()}
                </ListGroup>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    clients: state.clients
})

export default connect(
    mapStateToProps, { 
        removeClient,
        loadClientOuraData
    }
)(ClientList);