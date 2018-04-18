import React, { Component } from 'react';
import {Route} from 'react-router-dom';
//import logo from './logo.svg';
import classes from  './App.css';

import Navigation from './components/Navigation/Navigation';
import Home from './components/Frontend/Home/Home';


class App extends Component {


  render() {
    return (
      <div className={classes.App}> 
        <Navigation></Navigation>    
        <Route path="/" component={Home} />
      </div>
    );
  }
}

export default App;
