import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import InfoMessage from '../../UI/Message/InfoMessage';
import classes from './FlyerMaker.css';
import * as actions from '../../../store/actions/index';

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
                // console.log(e.target.files[0]);
                // // validate before adding
                if (this.validateImage(e.target.value)) {
                    let num = this.state.imgNum;
                    this.setState({imgNum: ++num});

                    //get signed
                    const file = e.target.files[0];
                    this.getSignedRequest(file);
                } else {
                    this.setState({imgErrors: 'Wrong File Type'});
                }
                
            } else {
                // image 2
                // validate before adding
                if (this.validateImage(e.target.value)) {
                    let num = this.state.imgNum;
                    //this.setState({image2: e.target.files[0]})
                    this.setState({imgNum: ++num});

                    //get signed
                    const file = e.target.files[0];
                    this.getSignedRequest(file);
                } else {
                    this.setState({imgErrors: 'Wrong File Type'});
                }
            }
        } else {
            this.setState({imgErrors: 'Max of 2 Images'});
        }
        document.getElementById('flyerImg').value = '';
    }
    getSignedRequest = (file) => {
        axios.get(`/sign-s3?file-name=${file.name}&file-type=${file.type}`)
            .then(response => {
                console.log(response.data.signedRequest);
                console.log(response.data.url);
                this.uploadFile(file, response.data.signedRequest, response.data.url);
            })
            .catch(err => {

            });
    }
    uploadFile = (file, signedRequest, url) => {
        axios({
            method: 'put',
            url: signedRequest,
            data: file,
            headers: {'Content-Type': 'image'}
        }).then(response => {
                // store the image urls in state to be sent to the backend
                if (this.state.imgNum === 1) {                    
                    this.setState({image1: url});
                } else if (this.state.imgNum === 2) {
                    this.setState({image2: url})
                }
            })
            .catch(err => console.log(err));
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

    handleSubmit = (e)=> {
        e.preventDefault();
        let isValid = true;
        // create data to send to server
            // && check whole form validity
        const data = new FormData();
        for(let ctr in this.state.controls) {
            //data[ctr] = this.state.controls[ctr].value;
            data.append(ctr, this.state.controls[ctr].value);
            if (this.state.controls[ctr].validation.length > 0) {
                // then it didn't pass validation
                isValid = false;
            }
        }
        data.append('userId',this.props.userRedux.user._id);
        data.append('phone',this.state.phone);
        data.append('email',this.state.email);
        data.append('placeId', this.props.locationRedux.selectedPlace.placeId);
        data.append('formatted_address', this.props.locationRedux.selectedPlace.formatted_address);
        data.append('name', this.props.locationRedux.selectedPlace.name);
        // set up formdata for images
        data.append('image1', this.state.image1);    
        data.append('image2', this.state.image2);
        

        // if isValid stays true 
        if (isValid) {
            // make axios call
            axios.post('/make-flyer', data)
                .then(response => {
                    // set FlyerMade
                    this.props.onSetFlyerMade(true);
                    // redirect to manage-home
                    this.props.history.push('/manage/');
                })
                .catch(err => {
                    // #TODO- Handle ReqErrors
                    this.setState({reqErrors: 'Could Not Make Flyer.'})
                })
        }
    }

    render() {
        let errorDisplay= this.errorDisplay();
        // reqErrors
        let reqErrorsDisplay = null;
        if (this.state.reqErrors) {
            reqErrorsDisplay = <InfoMessage messageType='fail'>Could No Post Your Flyer. Check Your Input.</InfoMessage>
        }
        return (
            <div className={classes.FlyerMaker}>
                <h3>Make Your Flyer</h3>
                <section>
                    {reqErrorsDisplay}
                    {errorDisplay}
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <label>Flyer Heading</label>
                            <input type="text" 
                                className="form-control"
                                name="heading"
                                onChange={this.inputChanged} />
                        </div>
                        {this.state.imgErrors? <InfoMessage messageType="fail">{this.state.imgErrors}</InfoMessage>: null}                     
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
                                onChange={this.inputChanged} 
                                rows="8"></textarea>
                        </div>
                        <div className='form-group'>
                            <label>Way to Contact You</label>
                            <div className='btn-group-sm'>
                                <input type="checkbox" value="email" onClick={this.onEmail}/> Email &nbsp; &nbsp;
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

const mapStateToProps = (state) => {
    return {
        userRedux: state.userRedux,
        locationRedux: state.locationRedux
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onSetFlyerMade: (bool) => dispatch(actions.setFlyerMade(bool))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FlyerMaker);