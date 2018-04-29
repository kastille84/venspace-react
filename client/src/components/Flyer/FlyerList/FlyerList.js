import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import FlyerListItem from '../FlyerListItem/FlyerListItem';

class FlyerList extends Component {
    getItems = () => {
        // they are signed in
        // mode = backend
        if (this.props.userRedux.signedIn && this.props.mode === 'backend') {
            if (this.props.flyerRedux.flyers.length > 0) {
                return this.props.flyerRedux.flyers.map(flyer => {
                    return <li className="list-group-item" key={flyer._id}><FlyerListItem flyer={flyer}></FlyerListItem></li>;
                })
            } else {
                return <p>No Flyers have been posted yet. Go to the map and search for a place to put a flyer at.</p>
            }

        }
        // they are signed in 
        // mode =  frontend
        if (this.props.userRedux.signedIn && this.props.mode === 'frontend') {
            if (this.props.locationRedux.selectedPlace) {
                // #TODO axios call to get list of all flyers at that location

            } else {
                return <p>No place selected yet. Search for a place to put a flyer at or browse current flyers at that location.</p>
            }
        }
        // they are NOT signed in
        // mode = frontend
        if (!this.props.userRedux.signedIn) {
            if (this.props.locationRedux.selectedPlace) {
                // #TODO axios call to get list of all flyers at that location

            } else {
                return <p>No place selected yet. Search for a place to browse current flyers at that location.</p>
            }
        }
    }

    getFlyers = () => {
        axios.get(`flyers-by-location/${this.props.locationRedux.selectedPlace.placeId}`)
            .then(places => {
                
            })
            .catch(err => {

            })
    }

    render() {
        return (
            <div>FlyerList
                
                <ul className="list-group">
                    {this.getItems()}
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

export default connect(mapStateToProps)(FlyerList);