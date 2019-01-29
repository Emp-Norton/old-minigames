import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/NavBar.jsx';
import TicTacToe from './components/TicTacToe.jsx';
import War from './components/War.jsx';
import Snake from './components/Snake.jsx';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

export default class App extends React.Component {
  constructor(props) {
  	super(props);
  }

  render() {
  	return (
  		<div>
      <Router>
        <div>
  		    <NavBar/>
          <Switch>
              <Route path="/snake" component={Snake} />
              <Route path="/war" component={War} />
              <Route path="/ttt" component={TicTacToe} />
          </Switch>
        </div>
  		</Router>
		  </div>
  		)
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));