import React, { Component } from 'react';

class FlyerListItem extends Component {
    render() {
        return (
            <div>
                <h4>{this.props.flyer.heading}</h4>
                <p>{this.props.flyer.description.slice(0, 60)} . . . </p>
            </div>
        )
    }
}

export default FlyerListItem;