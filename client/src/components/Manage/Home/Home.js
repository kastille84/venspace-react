import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import FlyerListWrapper from '../../Flyer/FlyerListWrapper/FlyerListWrapper';
import InfoMessage from '../../UI/Message/InfoMessage';

class Home extends Component {
    componentDidMount() {
        if (this.props.flyerRedux.flyerMade) {
            setTimeout(() => {
                this.props.onSetFlyerMade(false);
            }, 5000);
        }
    }

    render() {
        return (
            <div>
                <h3>Manage Your Flyers</h3>
                <p>Stats go here</p>
                {this.props.flyerRedux.flyerMade? <InfoMessage messageType="info">Your Flyer was Posted!</InfoMessage>: null}
                <FlyerListWrapper></FlyerListWrapper>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        flyerRedux: state.flyerRedux
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        onSetFlyerMade: (bool) => dispatch(actions.setFlyerMade(bool))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);