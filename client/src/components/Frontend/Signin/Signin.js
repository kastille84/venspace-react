import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfoMessage from '../../UI/Message/InfoMessage';

class Signin extends Component {

    render(){
        return (
            <div>
                {this.props.userRedux.registered? <InfoMessage messageType="info">Yay! You've registered! It's time to sign in with your new credentials.</InfoMessage> : null}
                signin
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userRedux: state.userRedux
    }
}

export default connect(mapStateToProps)(Signin);