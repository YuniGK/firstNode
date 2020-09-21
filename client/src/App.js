import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LadingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import ResgisterPage from './components/views/ResgisterPage/ResgisterPage'

function App() {
  return (
    <Router className = "app">
      <div>
        <Switch>
          {/*
          <Route exact path="/">
            <LandingPage />
          </Route>
          */}
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={ResgisterPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
