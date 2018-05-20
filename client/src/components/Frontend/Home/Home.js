import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import classes from './Home.css';
import MapWithASearchBox from '../../Map/MapWithASearchBox';
import FlyerListWrapper from '../../Flyer/FlyerListWrapper/FlyerListWrapper';
import InfoMessage from '../../UI/Message/InfoMessage';

class Home extends Component {
    state = {
        ipWasSet: false,
        showMap: true
    }
    componentWillMount() {
        //axios.get('http://ip-api.com/json')
        // axios({
        //     method: 'get',
        //     url: 'http://ip-api.com/json'})
        // .then(response => {
        //     console.log(response);
            
        //     //set zip
        //     let ltlng = {
        //     lat: response.data.lat,
        //     lng: response.data.lon
        //     }
        //     this.props.onSetIpLocation(ltlng);  
        //     this.setState({ipWasSet: true})          
        // })
        // .catch(err => {
        //     console.log(err);
        // })

        if ("geolocation" in navigator) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition(function(position) {
                //set zip
                let ltlng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.props.onSetIpLocation(ltlng);  
                this.setState({ipWasSet: true}); 
              });
          } else {
            /* geolocation IS NOT available */
          }

        this.props.onSetFlyers([]);
    }
    showMapToggle = () => {
        this.setState({showMap: !this.state.showMap});
    }

    render() {
        return (
            <div className={classes.Home}>
                <div className={classes.MapContainer}>
                    <span className={classes.BtnControls}>
                        <button 
                            onClick={this.showMapToggle}
                            className='btn btn-info'
                            >{this.state.showMap? 'Hide': 'View'} Map</button>
                    </span>
                    {this.props.locationRedux.validPlace === false? <InfoMessage messageType="fail">Your search is too broad. Please search a business location or address.</InfoMessage>: null}
                    {this.state.ipWasSet && this.state.showMap? <MapWithASearchBox /> : null}
                </div>
                <div className={classes.MapContainer}>
                    <FlyerListWrapper mode='frontend'></FlyerListWrapper>
                </div>
                {(this.props.flyerRedux.flyers.length === 0 )?
                    <p>Please Search A Business Location for Flyers.<br/> Be as specific as possible by using name of business and optionally the address</p>
                    :
                    null
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        locationRedux: state.locationRedux,
        flyerRedux: state.flyerRedux
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      onSetIpLocation: (ltlng) => dispatch(actions.setIpLocation(ltlng)),
      onSetFlyers: (flyers) => dispatch(actions.setFlyers(flyers))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);