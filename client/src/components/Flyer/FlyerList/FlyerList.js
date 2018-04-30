import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import FlyerListItem from '../FlyerListItem/FlyerListItem';

class FlyerList extends Component {

    getItems = () => {
          // they are signed in
        // mode = backend
  
        if (this.props.userRedux.signedIn && this.props.mode === 'backend') {
      //     if (this.props.flyerRedux.flyers.length > 0) {
      //         const flyersArr =  this.props.flyerRedux.flyers.map(flyer => {
      //             return <li className="list-group-item" key={flyer._id}><FlyerListItem flyer={flyer}></FlyerListItem></li>;
      //         });
      //         this.setState({searchedFlyers: flyersArr});
      //     } else {
      //         return <p>No Flyers have been posted yet. Go to the map and search for a place to put a flyer at.</p>
      //     }

        }

    // they are signed in 
    // mode =  frontend

      if (this.props.userRedux.signedIn && this.props.mode === 'frontend') {
      //     if (this.props.locationRedux.selectedPlace) {
      //         // #TODO axios call to get list of all flyers at that location

      //     } else {
      //         return <p>No place selected yet. Search for a place to put a flyer at or browse current flyers at that location.</p>
      //     }
      }

    // they are NOT signed in
    // mode = frontend
      if (!this.props.userRedux.signedIn) {
          // show them the whole list of flyers
          return this.props.flyerRedux.flyers.map(flyer => {
            return (
                <li className="list-group-item" key={flyer._id}>
                    <FlyerListItem flyer={flyer}></FlyerListItem>
                </li>
            );
          });
      //     if (this.props.locationRedux.selectedPlace) {
      //         // #TODO axios call to get list of all flyers at that location
      //         axios.get(`flyers-by-location/${this.props.locationRedux.selectedPlace.placeId}`)
      //             .then(response => {
      //                 if (response.data.flyers.length > 0) {
      //                     const flyersArr = response.data.flyers.map(flyer => {
      //                         return <li className="list-group-item" key={flyer._id}><FlyerListItem flyer={flyer}></FlyerListItem></li>;
      //                     });
      //                     this.setState({searchedFlyers: flyersArr});
      //                     // return flyersArr;

      //                 } else {
      //                     this.setState({searchedMessage: 'Did not find any flyers at this location'});
      //                 }
      //             })
      //             .catch(err => {
      //                 return <p>Could not search for flyers at this location. Try again later.</p>
      //             });
      //     } else {
      //         this.setState({searchedMessage: 'No place selected yet. Search for a place to browse current flyers at that location.'});
      //     }
      }
    }


    render() {
        
        return (
            <div>FlyerList
                
                <ul className="list-group">
                    {this.props.flyerRedux.flyers.map(flyer => {
                        const link = '/view-flyer/'+flyer._id;
                        if (this.props.userRedux.user !== null && flyer.user._id === this.props.userRedux.user._id) {
                            return (
                                <li className="list-group-item" key={flyer._id}>
                                    <Link to={link}>
                                        <span className="far fa-user"></span>
                                        <FlyerListItem flyer={flyer}></FlyerListItem>
                                    </Link>
                                </li>);
                        } else {
                            return (
                                <li className="list-group-item" key={flyer._id}>
                                    <Link to={link}>
                                        <FlyerListItem flyer={flyer}></FlyerListItem>
                                    </Link>
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



export default connect(mapStateToProps)(FlyerList);