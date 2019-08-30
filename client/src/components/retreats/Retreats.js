import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectRetreatListItem from './SelectRetreatListItem';
import AddRetreatModal from './AddRetreatModal';
import RemoveRetreatModal from './RemoveRetreatModal';
import {
    Spinner,
    ListGroup,
    ListGroupItem,
    Container
} from 'reactstrap';

class SelectRetreat extends Component {

    get_body = () => {
        if(this.props.retreats.isLoading){
            return <div className='mx-auto'><Spinner /></div>
        } else if (this.props.retreats.retreats){
            return this.props.retreats.retreats.map(retreat => {
                return (<SelectRetreatListItem retreat={retreat} key={retreat.id} />)
            })
        }
    }

    render() {
        const style = { maxWidth: '650px' };
        return (
            <Container>
                <h4 className='fade-in text-center open-sans text-muted'>Select a Retreat</h4>
                <ListGroup style={style} className='fade-in my-3 mx-auto'>
                    <ListGroupItem className='d-flex justify-content-around'>
                        <AddRetreatModal />
                        <RemoveRetreatModal retreats={this.props.retreats.retreats} />
                    </ListGroupItem>
                </ListGroup>
                <ListGroup style={style} className='fade-in mb-5 mx-auto'>
                    { this.get_body() }
                </ListGroup>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    retreats: state.retreats
})

export default connect(
    mapStateToProps
)(SelectRetreat);
