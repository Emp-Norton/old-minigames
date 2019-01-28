import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/NavBar.jsx';

export default class App extends React.Component {
  constructor(props) {
  	super(props);
  }

  render() {
  	return (
  		<div>
  		<NavBar/>
  			<p> HIYA!</p>
  		</div>
  		)
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));