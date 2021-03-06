import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListGroup } from 'reactstrap';
import AddGroupModal from './modals/AddGroupModal';
import GroupListItem from './GroupListItem';
import { removeGroup } from '../../../actions/groupActions';

class GroupList extends Component {
    get_body = () => {
        if(this.props.groups.groups){
            return (
                this.props.groups.groups.map(group => {
                    return (
                        <GroupListItem group={group}
                                       handle_removeGroup={this.handle_removeGroup}
                                       key={group.id}
                                    />
                    )
                })
            )
        }
    }

    render() {
        return (
            <div>
                <AddGroupModal />
                <ListGroup className='mt-4'>
                    { this.get_body() }
                </ListGroup>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    groups: state.groups
})

export default connect(
    mapStateToProps,
    { removeGroup }
)(GroupList);