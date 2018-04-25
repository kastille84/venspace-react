import React, { Component } from 'react';
import {Route, Redirect, withRouter, Switch} from 'react-router-dom';
//import logo from './logo.svg';
import classes from  './App.css';
import { connect } from 'react-redux';


import Navigation from './components/Navigation/Navigation';
import Home from './components/Frontend/Home/Home';
import Register from './components/Frontend/Register/Register';
import Signin from './components/Frontend/Signin/Signin';
import ManageHome from './components/Manage/Home/Home';
import FlyerMaker from './components/Flyer/FlyerMaker/FlyerMaker';


class App extends Component {

  // guard for only signined user
  getManage = () => {
    return (
      <Switch>
        <Route path="/manage/" exact component={ManageHome}  />
        <Route path='/manage/make-flyer' component={FlyerMaker} />
      </Switch>
    )
  }

  render() {
    return (
      <div className={classes.App}> 
        <Navigation></Navigation>    
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/signin" component={Signin} />
          {this.props.userRedux.user? this.getManage(): null}  
          <Route render={() => (<Redirect to="/signin" />)} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      userRedux: state.userRedux
  }
}

export default withRouter(connect(mapStateToProps)(App));
