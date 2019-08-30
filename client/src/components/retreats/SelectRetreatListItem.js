import React, { Component } from 'react';
import { selectRetreat } from '../../actions/retreatActions';
import { connect } from 'react-redux';
import { 
    ListGroupItem,
    Container,
    Col,
    Row
} from 'reactstrap';
import { withRouter } from 'react-router';

class SelectRetreatListItem extends Component {

    select_retreat = () => {
        this.props.selectRetreat(this.props.retreat, this.props.history);
    }

    render() {
        return (
            <ListGroupItem tag='button' 
                            href='#'
                            key={this.props.retreat.id}
                            action
                            className='d-flex justify-content-between'
                            onClick={this.select_retreat}
                        >
                <Container>
                    <Row>
                        <Col md={{size:6}} sm={{size:12}}>
                            <p className='text-center my-auto'>{this.props.retreat.name}</p>
                        </Col>
                        <Col md={{size:6}} sm={{size:12}} className='text-center'>
                            <span className='small my-auto'>Start: { this.props.retreat.date_created }</span>
                            <span className='ml-2 small text-success my-auto'>{ this.props.retreat.date_completed ? `Completed: ${this.props.retreat.date_completed}` : '(In Progress)'}</span>
                        </Col>
                    </Row>
                </Container>
            </ListGroupItem>
        );
    }
}

export default withRouter(connect(
    null,
    { selectRetreat }
)(SelectRetreatListItem));