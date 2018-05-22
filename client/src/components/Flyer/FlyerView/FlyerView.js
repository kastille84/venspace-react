import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import  classes  from './FlyerView.css';
import * as actions from '../../../store/actions/index';

class FlyerView extends Component {
    state = {
        selectedImageSrc: null,
        editMode: false
    }
    componentWillMount() {
        //check selectedFlyer is null, redirect back to home
        if (this.props.flyerRedux.selectedFlyer === null) {
            this.invalidPage()
            return;
        }
    }
    invalidPage = () => {
        this.props.history.push('/');
    }

    selectImageHandler = (e) => {
        this.setState({selectedImageSrc: e.target.src });
    }
    selectImageBlurHandler = (e) => {
        console.log('got called');
        this.setState({selectedImageSrc: null});
    }

    onEditHandler = (e) => {
        this.props.history.push('/manage/flyer-edit');
    }

    handleDeleteClick = () => {
        this.setState({editMode: !this.state.editMode});
    }

    getPictures = () => {
        if (this.props.flyerRedux.selectedFlyer.images.length > 0) {
            return this.props.flyerRedux.selectedFlyer.images.map((image, index) => {
                //const src = %PUBLIC_URL%+'/assets/images/flyers/'+image;
                return <img 
                    className="img-fluid img-thumbnail rounded" 
                    src={image} 
                    alt={image} 
                    key={image}
                    onClick={this.selectImageHandler}
                    onBlur={this.selectImageBlurHandler}
                    tabIndex={index}/>
            }); 
        }
        return null;
    }

    getContact = () => {
        return (
            <div>
                {this.props.flyerRedux.selectedFlyer.contact.phone === 'true'? 
                <small>Phone: {this.props.flyerRedux.selectedFlyer.user.phone}</small>
                : null}
                <br/>
                {this.props.flyerRedux.selectedFlyer.contact.email === 'true'? 
                <small>Email: {this.props.flyerRedux.selectedFlyer.user.email}</small>
                : null}
            </div>
        )
    }

    getButtons = () => {
        if (this.props.userRedux.signedIn) {
            if (this.props.flyerRedux.selectedFlyer.user._id === this.props.userRedux.user._id) {
                return (
                    <section>
                        <button 
                            className='btn btn-info'
                            onClick={this.onEditHandler} >Edit</button>
                        &nbsp;
                        {!this.state.editMode? 
                            <button className='btn btn-danger' onClick={this.handleDeleteClick}>&nbsp; X &nbsp;</button>
                            :
                            <button 
                                className='btn btn-danger' 
                                onClick={this.handleDelete}
                                onBlur={this.handleDeleteClick}
                                tabIndex='3'
                                >DELETE</button>

                        }
                    </section>
                )
            }
        }
    }

    handleDelete = () => {
        axios.delete('/delete-flyer/'+this.props.flyerRedux.selectedFlyer._id)
            .then(response => {
                console.log(response);
                //remove selectedflyer from  flyers 
                this.props.onRemoveFlyer(this.props.flyerRedux.selectedFlyer._id);
                // selectedflyer to null
                this.props.onSetSelectedFlyer(null);
                
                // flyer deleted
                this.props.onSetFlyerDeleted(true);

                // redirect to manage
                this.props.history.push('/manage/');

            })
            .catch(err => {

            })
    }


    decodeHtml = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    render() {
        if(!this.props.flyerRedux.selectedFlyer){
             return (
                 <div>Invalid Page</div>
             );
        } else {
            return (
                <div className={classes.FlyerView}>
                    <h2>{this.props.flyerRedux.selectedFlyer.heading}</h2>
                    <small>posted at {this.props.flyerRedux.selectedFlyer.place_id.name}</small>
                    <section className={classes.pictures}>
                        {this.getPictures()}                    
                    </section>
                    <div className={classes.displayPicture}>
                        {this.state.selectedImageSrc? 
                            <img 
                                src={this.state.selectedImageSrc} 
                                alt="selectedImage"
                                className="img-fluid"
                                />
                        : null
                        }
                    </div>
                    <hr />
                    <section className={classes.description} >
                        {this.decodeHtml(this.props.flyerRedux.selectedFlyer.description)}
                    </section>
                    <hr />
                    <section className={classes.contact}>
                        <h4>Contact Me Through: </h4>
                        {this.getContact()}
                    </section>
                    {this.getButtons()}
                </div>
            )

        }
        
    }
}

const mapStateToProps = (state) => {
    return {
        flyerRedux: state.flyerRedux,
        userRedux: state.userRedux,
        locationRedux: state.locationRedux
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSetSelectedFlyer: () => dispatch(actions.setSelectedFlyer(null)),
        onRemoveFlyer: (flyerId) => dispatch(actions.removeFlyer(flyerId)),
        onSetFlyerDeleted: (bool) => dispatch(actions.setDeletedFlyer(bool))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FlyerView);