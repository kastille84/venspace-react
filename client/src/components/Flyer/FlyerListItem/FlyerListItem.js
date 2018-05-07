import React, { Component } from 'react';
import classes from './FlyerListItem.css';

class FlyerListItem extends Component {
    decodeHtml = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    render() {
        return (
            <div className={classes.FlyerListItem}>
                <h4>{this.props.flyer.heading}</h4>
                <cite style={{'fontSize':'small'}}>posted at: {this.props.flyer.place_id.name}</cite>
                <hr/>
                <p>{this.decodeHtml(this.props.flyer.description.slice(0, 60))}...</p>
            </div>
        )
    }
}

export default FlyerListItem;