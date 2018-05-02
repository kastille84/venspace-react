import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './FlyerEdit.css';

import InfoMessage from '../../UI/Message/InfoMessage';

class FlyerEdit extends Component {
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

    componentDidMount() {
        // set controls
        let controlsCopy = this.state.controls;
        controlsCopy.heading.value = this.props.flyerRedux.selectedFlyer.heading;
        controlsCopy.description.value = this.props.flyerRedux.selectedFlyer.description;

        let imgNumCopy = this.state.imgNum;
            imgNumCopy = this.props.flyerRedux.selectedFlyer.images.length;
        let image1 = this.props.flyerRedux.selectedFlyer.images[0] || null;
        let image2 = this.props.flyerRedux.selectedFlyer.images[1] || null;
        let phone = this.props.flyerRedux.selectedFlyer.contact.phone;
        let email = this.props.flyerRedux.selectedFlyer.contact.email;

        this.setState({controls: controlsCopy});
        this.setState({imgNum : imgNumCopy});
        this.setState({image1: image1});
        this.setState({image2: image2});
        this.setState({phone: phone});
        this.setState({email: email});
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

    fileChanged = (e) => {        
        if (this.state.imgNum < 2) {
            if (!this.state.image1) {
                console.log(e.target.files[0]);
                // validate before adding
                if (this.validateImage(e.target.value)) {
                    let num = this.state.imgNum;
                    this.setState({image1: e.target.files[0]});
                    this.setState({imgNum: ++num});
                } else {
                    this.setState({imgErrors: 'Wrong File Type'});
                }
            } else {
                // image 2
                // validate before adding
                if (this.validateImage(e.target.value)) {
                    let num = this.state.imgNum;
                    this.setState({image2: e.target.files[0]})
                    this.setState({imgNum: ++num});
                } else {
                    this.setState({imgErrors: 'Wrong File Type'});
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
        let errorDisplay= this.errorDisplay();
        // reqErrors
        let reqErrorsDisplay = null;
        if (this.state.reqErrors) {
            reqErrorsDisplay = <InfoMessage messageType='fail'>Could No Edit Your Flyer. Check Your Input.</InfoMessage>
        }
        return (
            <div className={classes.FlyerEdit}>
                <h3>Edit Your Flyer</h3>
                <section>
                    {reqErrorsDisplay}
                    {errorDisplay}
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <label>Flyer Heading</label>
                            <input type="text" 
                                className="form-control"
                                name="heading"
                                onChange={this.inputChanged}
                                defaultValue={this.props.flyerRedux.selectedFlyer.heading} />
                        </div>
                        {this.state.imgErrors? <InfoMessage messageType="fail">{this.state.imgErrors}</InfoMessage>: null}                     
                        {this.state.imgNum > 0? <p>Num of Pics Uploaded: <br/> <span>{this.state.imgNum} / 2</span></p> : null}
                        <div className="form-group preview">
                            <label>Image Preview: </label><br/>
                            {this.state.image1? (
                                <span><img 
                                    className="img-fluid img-thumbnail rounded" 
                                    src={process.env.PUBLIC_URL + '/assets/images/flyers/'+this.state.image1} 
                                    alt={this.state.image1} />
                                    <br />
                                    <button className="btn btn-danger">X</button>
                                </span>
                            ): null}
                            {this.state.image2? (
                                <span><img 
                                    className="img-fluid img-thumbnail rounded" 
                                    src={process.env.PUBLIC_URL + '/assets/images/flyers/'+this.state.image2} 
                                    alt={this.state.image2} />
                                    <br />
                                    <button className="btn btn-danger">X</button>
                                </span>
                            ): null}
                        </div>
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
                                onChange={this.inputChanged} 
                                rows="8"
                                defaultValue={this.props.flyerRedux.selectedFlyer.description}></textarea>
                        </div>
                        <div className='form-group'>
                            <label>Way to Contact You</label>
                            <div className='btn-group-sm'>
                                <input 
                                    type="checkbox" 
                                    value="email" 
                                    onChange={this.onEmail}
                                    checked={this.state.email}
                                /> Email 
                                &nbsp; &nbsp;
                                <input 
                                    type="checkbox" 
                                    value="phone" 
                                    onChange={this.onPhone}
                                    checked={this.state.phone}
                                /> Phone                        
                            </div>
                        </div>
                        <button className="btn btn-primary">EDIT FLYER</button>

                    </form>
                </section>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        flyerRedux: state.flyerRedux
    }
}

export default connect(mapStateToProps)(FlyerEdit);