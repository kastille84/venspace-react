import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import classes from './Navigation.css'

class Navigation extends Component {

    render() {
        return (
            <nav className={classes.Navigation}>
                <span className={classes.logo}>
                    <NavLink to="/">VenSpace</NavLink>
                </span>
                {this.props.userRedux.signedIn? 
                <ul>
                    <li><NavLink to='/manage'>Manage</NavLink></li>
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
export default connect(mapStateToProps)(Navigation);