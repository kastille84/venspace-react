import React, { Component } from 'react';
import { connect } from 'react-redux';

import FlyerList from '../FlyerList/FlyerList';

class FlyerListWrapper extends Component {

    render() {
        return (
            <div>
                {(this.props.userRedux.signedIn&&this.props.locationRedux.selectedLocation)? <section><button>Put a Flyer at this Location</button></section>: null}
                <FlyerList></FlyerList>
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

export default connect(mapStateToProps)(FlyerListWrapper);