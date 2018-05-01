import React, { Component } from 'react';
import { connect } from 'react-redux';

class FlyerView extends Component {
    componentDidMount() {
        //check selectedFlyer is null, redirect back to home
        if (this.props.flyerRedux.selectedFlyer === null) {
            this.props.history.push('/home');
        }
    }

    render() {
        return (
            <div>Flyer view page</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        flyerRedux: state.flyerRedux
    }
}

export default connect(mapStateToProps)(FlyerView);