import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { removeFile } from '../../../../actions/clientActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ListGroupItem,
    Container,
    Row,
    Col,
    ListGroup,
    ModalFooter
} from 'reactstrap';

class FileBrowserModal extends Component {
    state = {
        modal: false,
        nestedModal: false,
        closeAll: false,
        fileToDelete: null
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    toggleNested = file => {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false,
            fileToDelete: file ? file : null
        });
    }

    toggleAll = () => {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: true,
            fileToDelete: null
        });
    }

    onSubmit = e => {
        e.preventDefault();
        
        // Send action
        this.props.removeFile(
            this.state.fileToDelete._id,
            this.props.client_id
        );

        this.toggleAll();
    }

    viewFile = fullfile => {
        console.log(fullfile);
    }

    get_body = () => {

        if(this.props.clients.clients){
            for(let client of this.props.clients.clients){
                if(client.id === this.props.client_id){
                    return client.files.map(file => {
                        return (<ListGroupItem tag='button' 
                                                href='#'
                                                key={file._id}
                                                action
                                                className='d-flex justify-content-between'>
                                    <Container>
                                        <Row>
                                            <Col md={{size:6}} sm={{size:12}} onClick={() => { this.viewFile(file.fullfile) }}>
                                                <p className='my-auto'>{file.filename}</p>
                                            </Col>
                                            <Col md={{size:6}} sm={{size:12}} className='my-auto'>
                                                <h1 className='text-danger my-auto pointer hover-darken-red small float-right'
                                                    onClick={() => { this.toggleNested(file) } }
                                                    name={file._id}>
                                                    remove
                                                    <FontAwesomeIcon icon={faTrash} className='ml-2'/>
                                                </h1>
                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroupItem>)
                    })
                }
            }
        }
    }

    render() {
        return (
            <Fragment>
                <Button color='info' className='mt-3' onClick={this.toggle}>My Files</Button>

                <Modal isOpen={this.state.modal} toggle={this.toggle} >
                    <ModalHeader>Files</ModalHeader>
                    <ModalBody>
                        <ListGroup>
                            { this.get_body() }
                        </ListGroup>

                        <Modal isOpen={this.state.nestedModal} 
                                toggle={this.toggleNested} 
                                onClosed={this.state.closeAll ? this.toggle : undefined}>
                            <ModalHeader className='text-danger'>Warning!</ModalHeader>
                            <ModalBody>
                                <h6>You are about to remove the following file:</h6>
                                <h6 className='text-primary'>
                                    {this.state.fileToDelete ? this.state.fileToDelete.filename : null}
                                </h6>
                                <h6>Are you sure you want to delete this file and all the information associated with it?</h6>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='dark' onClick={this.toggleNested}>Cancel</Button>{' '}
                                <Button color="danger" onClick={this.onSubmit}>Delete</Button>
                            </ModalFooter>
                        </Modal>

                    </ModalBody>
                </Modal>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    clients: state.clients
})

export default withRouter(connect(
    mapStateToProps,
    { removeFile }
)(FileBrowserModal));