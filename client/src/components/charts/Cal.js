import React, { Component, Fragment } from 'react';
import {
    Modal,
    ModalBody
} from 'reactstrap';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

class Cal extends Component {
    state = {
        modal: false,
        day: this.props.day
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    // componentWillUpdate({ day }){
    //     this.setState({ day });
    // }

    render() {
        return (
            <Fragment>
                <h1 className='small text-primary text-center pointer m-0' onClick={this.toggle}>
                    {this.props.text}
                </h1>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalBody className='d-flex justify-content-center'>
                        <InfiniteCalendar 
                                onSelect={this.props.changeDate} 
                                width={400} 
                                height={600} 
                                selected={this.state.day}
                            />
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

export default Cal;