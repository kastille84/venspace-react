import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import { connect } from 'react-redux';
//import logo from './logo.svg';
import classes from  './App.css';
import axios from 'axios';
import * as actions from './store/actions/index';

import Navigation from './components/Navigation/Navigation';
import Home from './components/Frontend/Home/Home';
import Register from './components/Frontend/Register/Register';
import Signin from './components/Frontend/Signin/Signin';


class App extends Component {
  //Get Location Initially
  componentWillMount() {
    axios.get('http://ip-api.com/json')
      .then(response => {
        console.log(response);
        //set zip
        this.props.onSetZip(response.data.zip);
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div className={classes.App}> 
        <Navigation></Navigation>    
        <Route path="/" exact component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/signin" component={Signin} />        
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetZip: (zip) => dispatch(actions.setZip(zip))
  }
}

export default connect(null, mapDispatchToProps)(App);
