import React from 'react';
import ReactDOM from 'react-dom';

export default class App extends React.Component {
  constructor(props) {
  	super(props);
  }

  render() {
  	return (
  		<div>
  			<p> HIYA!</p>
  		</div>
  		)
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));