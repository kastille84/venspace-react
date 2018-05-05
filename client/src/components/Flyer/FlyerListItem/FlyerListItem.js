import React, { Component } from 'react';

class FlyerListItem extends Component {
    decodeHtml = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    render() {
        return (
            <div>
                <h4>{this.props.flyer.heading}</h4>
                <p>{this.decodeHtml(this.props.flyer.description.slice(0, 60))}...</p>
            </div>
        )
    }
}

export default FlyerListItem;