import React, { Component } from 'react';
import MacrosPieChart from '../../charts/MacrosPieChart';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';

class NewClientSuccess extends Component {
    state = {
        client: this.props.location.state ? this.props.location.state.client : null
    }

    get_body = () => {
        if(this.state.client){
            return (
                <div className='my-5'>
                    <div>
                        <h2 className='my-3 text-center open-sans font-weight-bold'>
                            {this.state.client.firstname + ' ' + this.state.client.lastname}
                        </h2>
                        <h5 className='my-3 text-center text-muted'>Metabolic Type: {this.state.client.Metabolic_Type}</h5>
                    </div>
                    <div className='container my-4'>
                        <div className='row d-flex justify-content-center'>
                            <div className='w-50'>
                                <h4 className='mx-2 mt-3 mb-2 mx-auto text-center open-sans text-muted'>
                                    Macro Nutrients
                                </h4>
                                <p className='open-sans'>
                                    We found that your essental Macro Nutriens add up to
                                    <span className='text-danger'>{' ' + (this.state.client.Macros.carb * 100) + '% carbs,'}</span>
                                    <span className='text-warning'>{' ' + (this.state.client.Macros.fat * 100) + '% fat, '}</span>
                                    and
                                    <span className='text-primary'>{' ' + (this.state.client.Macros.protein * 100) + '% protein.'}</span>
                                </p>
                            </div>
                            <MacrosPieChart macros={this.state.client.Macros}
                                            height={175}
                                            width={300}
                                            className='mx-2'
                                        />
                        </div>
                    </div>
                    <p className='open-sans text-center text-muted'>
                        We have sent an email to the address you provided. If it is a valid email, please follow the link to connect your oura ring.
                    </p>
                    <div className='text-center'>
                        <Button className='mx-3' href='/' color='dark'>
                            Home
                        </Button>
                        <Button className='mx-3' href={`/view/${this.state.client.id}`} color='info'>
                            View Profile
                        </Button>
                    </div>
                </div>
            )
        } else {
            return (
                <h1>Error</h1>
            )
        }
    }

    render() {
        return (
            <div>
                { this.get_body() }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    retreats: state.retreats
})

export default withRouter(connect(
    mapStateToProps
)(NewClientSuccess));