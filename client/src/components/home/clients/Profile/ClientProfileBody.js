import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import LineBreak from '../../../display/LineBreak';
import moment from 'moment';
import {
    sendEmail,
    removeClient,
    updateClientProfile
} from '../../../../actions/clientActions';
import validator from 'email-validator';
import Alerts from '../../../partials/Alerts';
import FileBrowserModal from '../modals/FileBrowserModal';
import MacrosPieChart from '../../../charts/MacrosPieChart';
import axios from 'axios';
import {
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Row,
    Form,
    FormGroup,
    Label,
    Container,
    Input,
    Button,
    CustomInput
} from 'reactstrap';

class UserProfileBody extends Component {

    state = {
        activeTab: '1',
        msg: null,
        visible: true,
        file: null,
        filename: null,
        uploadState: false,
        age: moment().diff(moment(this.props.client.birthday).format('YYYY-MM-DD'), 'years'),
        medications: this.props.client.medications,
        gender: this.props.client.gender,
        Weight: this.props.client.data[0].meta.Weight,
        Water_Intake: this.props.client.Water_Intake,
        BMI: this.props.client.data[0].meta.BMI,
        Body_Fat_Percentage: this.props.client.data[0].meta.Body_Fat_Percentage,
        RMR: this.props.client.data[0].meta.RMR,
        LDL: this.props.client.data[0].meta.LDL,
        HDL: this.props.client.data[0].meta.HDL,
        TC: this.props.client.data[0].meta.TC,
        Trigs: this.props.client.data[0].meta.Trigs,
        Blood_Glucose: this.props.client.data[0].meta.Blood_Glucose,
        Hemoglobin: this.props.client.data[0].meta.Hemoglobin,
        email: this.props.client.email,
        birthday: this.props.client.birthday
    };
    
    toggle = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }

    deleteClient = () => {
        const { id } = this.props.client;
        if(window.confirm('You are about to delete this client, are you sure you want to delete them and all their data?')){
            this.props.removeClient(id, this.props.history);
        }
    }

    checkInt = (element, int) => {
        var parsedInt = parseFloat(int.replace(/,/g, ''));
        if(int === ''){
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        } else if(parsedInt){
            element.classList.add('is-valid');
            element.classList.remove('is-invalid');
        } else {
            element.classList.add('is-invalid');
            element.classList.remove('is-valid');
        }
    }

    checkEmail = (element, email) => {
        if(email === ''){
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        } else if(validator.validate(email)){
            element.classList.add('is-valid');
            element.classList.remove('is-invalid');
        } else if(!validator.validate(email)){
            element.classList.add('is-invalid');
            element.classList.remove('is-valid');
        }
    }

    onChange = e => {
        var item = {};
        if(
            e.target.name !== 'medications' &&
            e.target.name !== 'gender' &&
            e.target.name !== 'birthday' &&
            e.target.name !== 'email'
        ){
            this.checkInt(e.target, e.target.value);
        } else if (e.target.name === 'email'){
            this.checkEmail(e.target, e.target.value);
        }
        if(e.target.value === ''){
            if(this.props.client[e.target.name]){
                item[e.target.name] = this.props.client[e.target.name]
            } else if (this.props.client.data[0].meta[e.target.name]){
                item[e.target.name] = this.props.client.data[0].meta[e.target.name]
            } else {
                console.log('Something went wrong setting state for component');
            }
        } else item[e.target.name] = e.target.value;
        this.setState({ ...item });
    };

    parseInput = input => {
        return parseFloat(input.toString().replace(/,/g, ''));
    }

    fileChangeHandler = e => {
        if(e.target.files.length > 0){
            this.setState({
                file: e.target.files[0],
                filename: e.target.files[0].name
            }, () => {
                const data = new FormData();
                data.append('file', this.state.file);

                const options = {
                    method: 'POST',
                    url: '/upload-file',
                    headers: {
                        retreat_id: this.props.retreats.selected_retreat.id,
                        client_id: this.props.client.id,
                        'content-type': 'multipart/form-data'
                    },
                    data
                }

                axios(options)
                    .then(res => {
                        if(res.status === 200){
                            this.setState({ uploadState: 200 })
                        } else {
                            this.setState({ uploadState: 500 })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({ uploadState: 500 })
                    })
                });
        }
    }

    save = () => {
        // Get items from state
        var {
            medications, gender, Weight, 
            Water_Intake, BMI, Body_Fat_Percentage, 
            RMR, LDL, HDL, TC, Trigs, Blood_Glucose, 
            Hemoglobin, email, birthday
        } = this.state;

        // Look for errors
        var errors = [];

        // Parse what we need to parse
        Weight = this.parseInput(Weight);
        Water_Intake = this.parseInput(Water_Intake);
        BMI = this.parseInput(BMI);
        Body_Fat_Percentage = this.parseInput(Body_Fat_Percentage);
        RMR = this.parseInput(RMR);
        LDL = this.parseInput(LDL);
        HDL = this.parseInput(HDL);
        TC = this.parseInput(TC);
        Trigs = this.parseInput(Trigs);
        Blood_Glucose = this.parseInput(Blood_Glucose);
        Hemoglobin = this.parseInput(Hemoglobin);

        if(
            !Weight || !Water_Intake || !BMI ||
            !Body_Fat_Percentage || !RMR || !LDL ||
            !HDL || !TC || !Trigs || !Blood_Glucose ||
            !Hemoglobin
        ) {
            errors.push({ msg: 'Invalid input' });
        } else if (!validator.validate(email)){
            errors.push({ msg: 'Invalid email' })
        }

        if(errors.length > 0){
            this.setState({ msg: errors[0].msg });
        } else {
            const data = {
                medications, gender, Weight, 
                Water_Intake, BMI, Body_Fat_Percentage, 
                RMR, LDL, HDL, TC, Trigs, Blood_Glucose, 
                Hemoglobin, email, birthday,
                client_id: this.props.client.id
            }
            this.props.updateClientProfile(data)
                .then(() => this.setState({ msg: 'Success!' }))
        }
    }

    authenticateViaEmail = () => {
        const { id, email } = this.props.client;

        this.props.sendEmail(id, email);
    }

    

    getAlerts = () => {
        var color = this.state.msg === 'Success!' ? 'success' : 'danger';
        return <Alerts color={color} msg={this.state.msg} />
    }

    getUploadStateAlerts = () => {
        if(this.state.uploadState === 200){
            return <Alerts color='success' msg='Success!' />
        } else if (this.state.uploadState === 500) {
            return <Alerts color='danger' msg='Error' />
        }
    }

    render() {
        const label = { width: '60px' };
        const mdLabel = { width: '130px' };
        
        return (
            <Container>
                <Row>
                    <Col sm={{size: 12}} md={{size: 4}} className='h-100 p-5 rounded-border mb-4'>
                        <h2 className='my-2 text-dark-blue text-center open-sans'>
                            {this.props.client.firstname + ' ' + this.props.client.lastname}
                        </h2>
                        <p className='my-2 text-center text-muted font-weight-bold'>
                            {this.props.client.Metabolic_Type.toUpperCase()}
                        </p>
                        <LineBreak sm/>
                        <div className='my-4 text-center'>
                            <h6>Notes</h6>
                            <Input type='textarea' name='medications' onChange={this.onChange} placeholder={this.props.client.medications} className='text-muted'/>
                        </div>
                        { this.getAlerts() }
                        <Button outline
                                className='open-sans my-4 d-block custom-outline-btn' 
                                color='success'
                                onClick={this.save}>
                            Save
                        </Button>
                        <h1 className='small text-center mt-4 mb-2 font-weight-bold'>Macros</h1>
                        <div className='d-flex justify-content-between'>
                            <div className='d-flex flex-column justify-content-around'>
                                <span style={{color:'#FF6384'}} className='small font-weight-bold'>CARBS {(this.props.client.Macros.carb*100) + ' %'}</span>
                                <span style={{color:'#36A2EB'}} className='small font-weight-bold'>PROTEIN {(this.props.client.Macros.protein*100) + ' %'}</span>
                                <span style={{color:'#FFCE56'}} className='small font-weight-bold'>FAT {(this.props.client.Macros.fat*100) + ' %'}</span>
                            </div>
                            <MacrosPieChart macros={this.props.client.Macros} />
                        </div>
                    </Col>
                    <Col sm={{size: 0}} md={{size: 1}}></Col>
                    <Col className='w-100' sm={{size: 12}} md={{size: 7}}>
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '1' })}
                                         onClick={() => { this.toggle('1'); }}
                                        >
                                    Profile
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '2' })}
                                         onClick={() => { this.toggle('2'); }}
                                        >
                                    Settings
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row className='my-4 px-3'>
                                    <Col md={{size:12}} className='my-2 rounded-border p-4'>
                                        <h5 className='mb-4 open-sans text-dark-blue'>Smart Scale</h5>
                                        <Form className='px-3'>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>WEIGHT:</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='Weight' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.Weight + ' lbs'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>WATER INTAKE:</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='Water_Intake' className='ml-1 text-muted' placeholder={this.props.client.Water_Intake + ' oz'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>BODY MASS INDEX:</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='BMI' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.BMI + ' kg/m2'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>BODY FAT PERCENTAGE:</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='Body_Fat_Percentage' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.Body_Fat_Percentage + ' %'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>BASEL METABOLIC RATE:</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='RMR' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.RMR.toLocaleString() + ' cal'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Form>
                                    </Col>
                                    <Col md={{size:12}} className='my-2 rounded-border p-4'>
                                        <h5 className='mb-3 open-sans text-dark-blue'>Lipid Profile</h5>
                                        <Form className='px-3'>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>{'LOW DENSITY LIPID PROFILE (LDL):'}</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='LDL' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.LDL + ' mg/dL'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>{'HIGH DENSITY LIPID PROFILE (HDL):'}</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='HDL' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.HDL + ' mg/dL'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>{'TOTAL CHOLESTEROL:'}</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='TC' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.TC + ' mg/dL'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='my-auto small text-dark-blue font-weight-bold w-100'>{'R. Cool/HDL Ratio:'}</Label>
                                                    </Col>
                                                    <h6 className='my-auto ml-3 text-muted mx-4'>{this.props.client.data[0].meta.Ratio}<span className='small'>{' mg/dL'}</span></h6>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>{'TRIGLYCERIDES:'}</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='Trigs' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.Trigs + ' mg/dL'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>{'BLOOD GLUCOSE:'}</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='Blood_Glucose' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.Blood_Glucose + ' mg/dL'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container row className='my-4'>
                                                <Row>
                                                    <Col className='my-2' sm={{size:12}} md={{size:6}}>
                                                        <Label style={mdLabel} className='small text-dark-blue font-weight-bold my-auto w-100'>{'HEMOGLOBIN:'}</Label>
                                                    </Col>
                                                    <Col sm={{size:12}} md={{size:6}}>
                                                        <Input type='text' onChange={this.onChange} name='Hemoglobin' className='ml-1 text-muted' placeholder={this.props.client.data[0].meta.Hemoglobin + ' g/dL'} />
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Form>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row className='my-4 px-3'>
                                    <Col md={{size:12}} className='my-2 rounded-border p-4'>
                                        <h5 className='mb-3 open-sans text-dark-blue'>Settings</h5>
                                        <Form className='px-3'>
                                            <FormGroup row className='mb-2'>
                                                <Label style={label} className='small text-dark-blue font-weight-bold'>{'AGE:'}</Label>
                                                <h6 className='mx-5 text-muted'>{this.state.age}<span className='small'>{' years'}</span></h6>
                                            </FormGroup>
                                            <FormGroup row className='my-3'>
                                                <Label style={label} className='small text-dark-blue font-weight-bold my-auto'>EMAIL:</Label>
                                                <Col className='ml-3'>
                                                    <Input type='text' onChange={this.onChange} name='email' className='ml-1 text-muted' placeholder={this.props.client.email} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label>File</Label>
                                                <div className='w-100'>{ this.getUploadStateAlerts() }</div>
                                                <CustomInput type="file" label={this.state.filename ? this.state.filename : 'Upload a file'} onChange={this.fileChangeHandler} name="file" />
                                                <FileBrowserModal client_id={this.props.client.id} />
                                            </FormGroup>
                                            <FormGroup row className='my-3 d-flex justify-content-between'>
                                                <Label style={label} className='my-auto small text-dark-blue font-weight-bold'>{'ÖURA:'}</Label>
                                                <Button outline 
                                                        className='mr-3 open-sans my-4 d-block custom-outline-btn' 
                                                        color='success'
                                                        onClick={this.authenticateViaEmail}>
                                                    Authenticate
                                                </Button>
                                            </FormGroup>
                                            <FormGroup row className='my-3'>
                                                <Label style={label} className='small text-dark-blue font-weight-bold my-auto'>SEX:</Label>
                                                <Col className='ml-3'>
                                                    <Input type='select'
                                                            name='gender'
                                                            value={this.state.gender} 
                                                            className='ml-1 text-muted'
                                                            onChange={this.onChange}>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row className='my-3'>
                                                <Label style={label} className='small text-dark-blue font-weight-bold my-auto'>BIRTHDAY:</Label>
                                                <Col className='ml-3'>
                                                    <Input type='date'
                                                            name='birthday'
                                                            defaultValue={this.props.client.birthday} 
                                                            className='ml-1 text-muted'
                                                            onChange={this.onChange} />
                                                </Col>
                                            </FormGroup>
                                            <Button onClick={this.deleteClient}
                                                    color='danger'
                                                    block>
                                                Delete
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    retreats: state.retreats
})

export default withRouter(connect(
    mapStateToProps,
    { removeClient, sendEmail, updateClientProfile }
)(UserProfileBody));