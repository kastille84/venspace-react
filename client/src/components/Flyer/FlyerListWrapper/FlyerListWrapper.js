import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import FlyerList from '../FlyerList/FlyerList';

class FlyerListWrapper extends Component {

    onMakeFlyerRedirect= () => {
        this.props.history.push('/manage/make-flyer');
    }

    render() {
        return (
            <div>
                {(this.props.userRedux.signedIn
                    &&this.props.locationRedux.selectedPlace
                    &&this.props.mode==='frontend')? <section><button onClick={this.onMakeFlyerRedirect}>Put a Flyer at this Location</button></section>: null}
                    
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

export default withRouter(connect(mapStateToProps)(FlyerListWrapper));