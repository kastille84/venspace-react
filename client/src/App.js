import React, { Component } from 'react';
import {Route} from 'react-router-dom';
//import logo from './logo.svg';
import classes from  './App.css';


import Navigation from './components/Navigation/Navigation';
import Home from './components/Frontend/Home/Home';
import Register from './components/Frontend/Register/Register';
import Signin from './components/Frontend/Signin/Signin';


class App extends Component {


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



export default App;
