import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classes from './Register.css';
import InfoMessage from '../../UI/Message/InfoMessage';

class Register extends Component {
	state = {
		controls: {
			name: {
				value: '',
				validation: []
			},
			email: {
				value: '',
				validation: []
			},
			password: {
				value: '',
				validation: []
			},
			password_retry: {
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
        let controlName = (control !== 'password_retry')? control: 'password';
        console.log(controlName);
		// check all if empty
		if (value.trim() === '') {					
			errorMessage.push(`${controlName.toUpperCase()} must not be empty`);
		}
		
		switch(control) {
            case 'name':
				// check max length of 80
				if (value.length > 80) {
					errorMessage.push(`${controlName.toUpperCase()} must not be more than 80 characters`);
                }
				return errorMessage;
			case 'email':
				if (value.trim().length > 100) {
					errorMessage.push(`${controlName.toUpperCase()} must not be more than 100 characters`);
				}
				// check is email
                if (!value.trim().match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
                    errorMessage.push("Not a Valid Email");
                }
				return errorMessage;
			case 'password':
                // check is maxlength 20 chars
                if (value.trim().length > 20) {
					errorMessage.push(`${controlName.toUpperCase()} must not be more than 20 characters`);
                }
                // check is minlength 6 chars
                if (value.trim().length < 6) {
					errorMessage.push(`${controlName.toUpperCase()} must be more than 6 characters`);
                }
                return errorMessage;
			case 'password_retry':
				if (this.state.controls.password.value !== value ) {
					errorMessage.push(`Passwords Do Not Match. Check Your Typing.`);	
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
		
    }

    render() {
        let errorDisplay = this.errorDisplay();

        return (
            <div className={classes.Register}>                
                <h2>Register to VenSpace</h2>
                <p><small>Already registered? <Link to="/signin">signin</Link></small></p>
                <section>
                    {errorDisplay}
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type='text' 
                                className="form-control"
								name="name"
								value={this.state.name}
								onChange={this.inputChanged}
							/>
                        </div>
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
						<div className="form-group">
                            <label>Retype Password</label>
                            <input 
                                type='password' 
                                className="form-control"
								name="password_retry"
								value={this.state.password_retry}
								onChange={this.inputChanged}
							/>
                        </div>
						<button	className="btn btn-primary">REGISTER</button>
                    </form>

                </section>
                
            </div>
        )
    }
}

export default Register;