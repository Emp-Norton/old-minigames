import React from 'react';
import Deck from './Deck.jsx';

export default class War extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <h1> WAR </h1>
        <div id="battlefield">
          <Deck cards={[]} />
        </div>
      </div>
    )
  }
}

