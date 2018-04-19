import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import classes from './Navigation.css'

class Navigation extends Component {

    render() {
        return (
            <nav className={classes.Navigation}>
                <span className={classes.logo}>
                    <NavLink to="/">VenSpace</NavLink>
                </span>
                <ul>
                    <li><NavLink to='/register'>Register</NavLink></li>
                    <li><NavLink to='/signin'>Signin</NavLink></li>
                </ul>
            </nav>
        )
    }
}

export default Navigation;