import React, { Component } from 'react';
import FlyerListWrapper from '../../Flyer/FlyerListWrapper/FlyerListWrapper';

class Home extends Component {

    render() {
        return (
            <div>
                <h3>Manage Your Flyers</h3>
                <p>Stats go here</p>
                <FlyerListWrapper></FlyerListWrapper>
            </div>
        )
    }
}

export default Home;