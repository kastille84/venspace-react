import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InfoMessage from '../../UI/Message/InfoMessage';
import classes from './Signin.css';
import * as actions from '../../../store/actions/index';

class Signin extends Component {
    state = {
        controls: {
            email: {
                value: '',
                validation: []
            },
            password: {
                value: '',
                validation: []
            }
        },
        isValid: false,
        reqErrors: null
    }

    inputChanged = (event) => {
        let updatedControls = {...this.state.controls}
		const inputName = event.target.name;
		let updatedInput = updatedControls[inputName];
		
		updatedInput.value = event.target.value;
		updatedInput.validation = this.checkValidity(event.target.name, event.target.value);
		
		updatedControls[inputName] = updatedInput;
		this.setState({controls: updatedControls});
    }

    checkValidity = (control, value) => {
        let errorMessage = [];
		// check all if empty
		if (value.trim() === '') {					
			errorMessage.push(`${control.toUpperCase()} must not be empty`);
		}
		
		switch(control) {
			case 'email':
				if (value.trim().length > 100) {
					errorMessage.push(`${control.toUpperCase()} must not be more than 100 characters`);
				}
				// check is email
                if (!value.trim().match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
                    errorMessage.push("Not a Valid Email");
                }
				return errorMessage;
			case 'password':
                // check is maxlength 20 chars
                if (value.trim().length > 20) {
					errorMessage.push(`${control.toUpperCase()} must not be more than 20 characters`);
                }
                // check is minlength 6 chars
                if (value.trim().length < 6) {
					errorMessage.push(`${control.toUpperCase()} must be more than 6 characters`);
                }
                return errorMessage;
			default: 
				return errorMessage;
        }
        
    }

    errorDisplay = () => {
        let errors =[];
        let errorDisplay = null;

        if (!this.state.isValid) {
            // load up the errors
            for (let ctr in this.state.controls) {
                if (this.state.controls[ctr].validation.length > 0) {
                    errors.push(...this.state.controls[ctr].validation);
                }
            }
            // map the errors with infomessage
            errorDisplay = (
                <ul style={{listStyle: 'none'}}>
                    {errors.map( (err, index) => (
                        <li key={index}>
                            <InfoMessage messageType="fail">{err}</InfoMessage>
                        </li>
                    ))}
                </ul>
            )
        }
        return errorDisplay;
     }

    handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;
        // create data to send to server
            // && check whole form validity
        const data = {};
        for(let ctr in this.state.controls) {
            data[ctr] = this.state.controls[ctr].value;
            if (this.state.controls[ctr].validation.length > 0) {
                // then it didn't pass validation
                isValid = false;
            }
        }
        // if isValid stays true 
        if (isValid) {
            // make axios call
            axios.post('/signin', data)
                .then(response => {
                    //console.log('data', response.data);
                    // set user data on Redux
                    this.props.onSetUser(response.data);
                    this.props.onSetSignin(true);
                    // redirect them to s
                    //this.props.history.push('/signin');
                })
                .catch(e => {

                })
        }
    }

    render(){
        let errorDisplay= this.errorDisplay();
        return (
            <div className={classes.Signin}>
                {this.props.userRedux.registered? <InfoMessage messageType="info">Yay! You've registered! It's time to sign in with your new credentials.</InfoMessage> : null}
                <h2>Signin to VenSpace</h2>
                <p><small>Don't have an account? <Link to="/register">Register</Link></small></p>
                <section>
                    {errorDisplay}
                    <form onSubmit={this.handleSubmit}>
						<div className="form-group">
                            <label>Email</label>
                            <input 
                                type='text' 
                                className="form-control"
								name="email"
								value={this.state.email}
								onChange={this.inputChanged}
							/>
                        </div>
						<div className="form-group">
                            <label>Password</label>
                            <input 
                                type='password' 
                                className="form-control"
								name="password"
								value={this.state.password}
								onChange={this.inputChanged}
							/>
                        </div>
						<button	className="btn btn-primary">SIGNIN</button>
                    </form>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userRedux: state.userRedux
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSetUser: (data) => dispatch(actions.setUser(data)),
        onSetSignin: (bool) => dispatch(actions.setSignin(bool))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);