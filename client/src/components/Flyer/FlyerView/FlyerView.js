import React, { Component } from 'react';
import { connect } from 'react-redux';
import  classes  from './FlyerView.css';

class FlyerView extends Component {
    state = {
        selectedImageSrc: null
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

    getPictures = () => {
        if (this.props.flyerRedux.selectedFlyer.images.length > 0) {
            return this.props.flyerRedux.selectedFlyer.images.map((image, index) => {
                //const src = %PUBLIC_URL%+'/assets/images/flyers/'+image;
                return <img 
                    className="img-fluid img-thumbnail rounded" 
                    src={process.env.PUBLIC_URL + '/assets/images/flyers/'+image} 
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
                        <button className='btn btn-danger'>&nbsp; X &nbsp;</button>
                    </section>
                )
            }
        }
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
                    <section className={classes.description}>
                        {this.props.flyerRedux.selectedFlyer.description}
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
        userRedux: state.userRedux
    }
}

export default connect(mapStateToProps)(FlyerView);