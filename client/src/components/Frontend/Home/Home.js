
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import MapWithASearchBox from '../../Map/MapWithASearchBox';


class Home extends Component {
    state = {
        ipWasSet: false
    }
    componentWillMount() {
        axios.get('http://ip-api.com/json')
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

    render() {
        return (
            <div>
                <div>
                    {this.state.ipWasSet? <MapWithASearchBox /> : null}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      onSetIpLocation: (ltlng) => dispatch(actions.setIpLocation(ltlng))
    }
}

export default connect(null, mapDispatchToProps)(Home);