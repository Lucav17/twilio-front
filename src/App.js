import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Index, Login, Dashboard } from './pages/export';
import NavBar from './components/Header';
import './assets/style.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/account/dashboard' exact component={Dashboard} />
        </Switch>
      </div>
    );
  }
}

export default App;
