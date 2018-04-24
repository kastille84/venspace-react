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
        axios({
            method: 'get',
            url: 'http://ip-api.com/json'})
        .then(response => {
            console.log(response);
            
            //set zip
            let ltlng = {
            lat: response.data.lat,
            lng: response.data.lon
            }
            this.props.onSetIpLocation(ltlng);  
            this.setState({ipWasSet: true})          
        })
        .catch(err => {
            console.log(err);
        })
    }
    showMapToggle = () => {
        this.setState({showMap: !this.state.showMap});
    }

    render() {
        return (
            <div className={classes.Home}>
                <div className={classes.MapContainer}>
                    <span className={classes.BtnControls}>
                        <button onClick={this.showMapToggle}>{this.state.showMap? 'Hide': 'View'} Map</button>
                    </span>
                    {this.props.locationRedux.validPlace === false? <InfoMessage messageType="fail">Your search is too broad. Please search a business location or address.</InfoMessage>: null}
                    {this.state.ipWasSet && this.state.showMap? <MapWithASearchBox /> : null}
                </div>
                <FlyerListWrapper></FlyerListWrapper>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        locationRedux: state.locationRedux
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      onSetIpLocation: (ltlng) => dispatch(actions.setIpLocation(ltlng))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);