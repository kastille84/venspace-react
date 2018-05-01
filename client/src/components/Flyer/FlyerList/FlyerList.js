import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../store/actions/index';

import FlyerListItem from '../FlyerListItem/FlyerListItem';

class FlyerList extends Component {

    selectFlyerHandler = (flyer, link) => {
        this.props.onSetSelectedFlyer(flyer);
        this.props.history.push(link);
    }

    render() {
        
        return (
            <div>FlyerList
                
                <ul className="list-group">
                    {this.props.flyerRedux.flyers.map(flyer => {
                        const link = '/view-flyer/'+flyer._id;
                        if (this.props.userRedux.user !== null && flyer.user._id === this.props.userRedux.user._id) {
                            return (
                                <li className="list-group-item" key={flyer._id} onClick={() => this.selectFlyerHandler(flyer, link)}>                                    
                                        <span className="far fa-user"></span>
                                        <FlyerListItem flyer={flyer} ></FlyerListItem>                                    
                                </li>);
                        } else {
                            return (
                                <li className="list-group-item" key={flyer._id} onClick={() => this.selectFlyerHandler(flyer, link)}>
                                        <FlyerListItem flyer={flyer} ></FlyerListItem>
                                    
                                </li>);
                        }
                    })}
                   
                </ul>
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
        onSetSelectedFlyer: (flyer) => dispatch(actions.setSelectedFlyer(flyer))
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlyerList));