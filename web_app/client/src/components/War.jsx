import React from 'react';
import Deck from './Deck.jsx';
import rules from './resources/war_rules.js';

export default class War extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: null,
      player2: null,
      p1_deck: [],
      p2_deck: [],
    }
  }

  componentDidMount() {
    const p1 = rules.player('James');
    const p2 = rules.player('Jon');
    this.setState({player1: p1, player2: p2});
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

