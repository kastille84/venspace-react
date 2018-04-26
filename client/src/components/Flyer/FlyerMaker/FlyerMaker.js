import React, { Component } from 'react';

import InfoMessage from '../../UI/Message/InfoMessage';
import classes from './FlyerMaker.css';

class FlyerMaker extends Component {
    state = {
        controls: {
            heading: {
                value: '',
                validation: []
            },
            description: {
                value: '',
                validation: []
            }
        },
        imgNum:0,        
        image1: null,
        image2: null,
        imgErrors: false,
        phone: false,
        email: false,
        isValid: false,
        reqErrors: false
    }

    fileChanged = (e) => {        
        if (this.state.imgNum < 2) {
            if (!this.state.image1) {
                console.log(e.target.files[0]);
                // validate before adding
                if (this.validateImage(e.target.value)) {
                    let num = this.state.imgNum;
                    this.setState({image1: e.target.files[0]});
                    this.setState({imgNum: ++num});
                }
            } else {
                // image 2
                // validate before adding
                if (this.validateImage(e.target.value)) {
                    let num = this.state.imgNum;
                    this.setState({image2: e.target.files[0]})
                    this.setState({imgNum: ++num});
                }
            }
        } else {
            this.setState({imgErrors: 'Max of 2 Images'});
        }
        document.getElementById('flyerImg').value = '';
    }
    validateImage = (str) => {
        const indexOfPeriod = str.indexOf('.');
        const fileType = str.slice(indexOfPeriod+ 1, str.length);
        switch (fileType) {
            case 'png':
            case 'PNG':
                return true;
            case 'jpg':
            case 'JPG':
                return true;
            case 'jpeg': 
            case 'JPEG':
                return true;
            case 'gif':
            case 'GIF':
                return true;
            default:
                return false;
            
        }
    }
    onEmail = (e) => {
        this.setState({email: !this.state.email});
    }
    onPhone = (e) => {
        this.setState({phone: !this.state.phone});
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
			case 'heading':
				if (value.trim().length > 100) {
					errorMessage.push(`${control.toUpperCase()} must not be more than 100 characters`);
				}
				return errorMessage;
			case 'description':
                // check is maxlength 2000 chars
                if (value.trim().length > 2000) {
					errorMessage.push(`${control.toUpperCase()} must not be more than 2000 characters`);
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

    handleSubmit = (e)=> {

    }

    render() {
        return (
            <div className={classes.FlyerMaker}>
                <h3>Make Your Flyer</h3>
                <section>
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <label>Flyer Heading</label>
                            <input type="text" 
                                className="form-control"
                                name="heading"
                                onChange={this.inputChanged} />
                        </div>
                        {this.state.imgErrors? <InfoMessage messageType="fail">Max Pics Reached!</InfoMessage>: null}                     
                        {this.state.imgNum > 0? <p>Num of Pics Uploaded: <br/> <span>{this.state.imgNum} / 2</span></p> : null}
                        
                        <div className='form-group'>
                            <label>Image Upload</label>
                            <input type="file" 
                                className="form-control"
                                name="img"
                                id="flyerImg"
                                onChange={this.fileChanged} />
                        </div>
                        <div className='form-group'>
                            <label>Description</label>
                            <textarea 
                                className='form-control'
                                name="description" 
                                onChange={this.inputChanged} ></textarea>
                        </div>
                        <div className='form-group'>
                            <label>Way to Contact You</label>
                            <div className='btn-group-sm'>
                                <input type="checkbox" value="email" onClick={this.onEmail}/> Email
                                <input type="checkbox" value="phone" onClick={this.onPhone}/> Phone                        
                            </div>
                        </div>
                        <button className="btn btn-primary">MAKE FLYER</button>

                    </form>
                </section>
                
            </div>
        )
    }
}

export default FlyerMaker;