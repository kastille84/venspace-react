import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../../../store/actions/index';

import FlyerList from '../FlyerList/FlyerList';

class FlyerListWrapper extends Component {
    state ={
        flyerList: []
    }
    componentWillMount() {
        if (this.props.mode === 'backend') {
            console.log('whoa')
            axios.get(`flyers-by-user/${this.props.userRedux.user._id}`)
                .then(response => {
                    this.props.onSetFlyers(response.data.flyers);
                }) 
                .catch(err=> {
                    console.log('err', err);
                });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.locationRedux.selectedPlace === nextProps.locationRedux.selectedPlace) {
            return false;
        }
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.locationRedux.selectedPlace !== nextProps.locationRedux.selectedPlace) {
            if (this.props.mode === 'frontend') {
                axios.get(`flyers-by-location/${nextProps.locationRedux.selectedPlace.placeId}`)
                .then(response => {
                    // no place was found, 
                        //therefor NO fLYERS
                    if (response.data.noPlace) {
                        this.props.onSetFlyers([]);
                    } else {
                        // place found, we have flyers
                        this.props.onSetFlyers(response.data.flyers);
                    }
                })
                .catch(err => {
                  console.log(err)
                });
            } 
        }
    }
    onMakeFlyerRedirect= () => {
        this.props.history.push('/manage/make-flyer');
    }

    render() {
        return (
            <div>                
                <section>
                {(this.props.userRedux.signedIn
                    &&this.props.locationRedux.selectedPlace)?
                    <button 
                        className="btn btn-success mb-2"
                        onClick={this.onMakeFlyerRedirect}>Put a Flyer at this Location</button>
                    : 
                    null
                }
                    <FlyerList></FlyerList>    
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userRedux: state.userRedux,
        locationRedux: state.locationRedux,
        flyerRedux: state.flyerRedux
    }
}   

const mapDispatchToProps = (dispatch) => {
    return {
        onSetFlyers: (flyers) => dispatch(actions.setFlyers(flyers))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlyerListWrapper));