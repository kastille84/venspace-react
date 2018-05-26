import React, { Component } from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import classes from './Navigation.css'
import * as actions from '../../store/actions/index';

class Navigation extends Component {
    logout = (e) => {
        e.preventDefault();
        // set logout
        this.props.onSetLogout();
        // redirect to Hom
        this.props.history.push('/signin');
    }

    render() {
        return (
            <nav className={classes.Navigation}>
                <span className={classes.logo}>
                    <NavLink to="/">VenSpace</NavLink>
                </span>
                {this.props.userRedux.signedIn? 
                <ul>
                    <li><NavLink to='/manage'>Manage</NavLink></li>
                    <li><NavLink to='#' onClick={this.logout}>Logout</NavLink></li>
                </ul>
                :
                <ul>                    
                    <li><NavLink to='/register'>Register</NavLink></li>
                    <li><NavLink to='/signin'>Signin</NavLink></li>
                </ul>
                }
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userRedux: state.userRedux
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onSetLogout: () => dispatch(actions.setSignin(false)) 
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));