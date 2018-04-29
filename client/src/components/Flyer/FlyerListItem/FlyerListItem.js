import React, { Component } from 'react';

class FlyerListItem extends Component {
    render() {
        return (
            <div>{this.props.flyer._id}</div>
        )
    }
}

export default FlyerListItem;