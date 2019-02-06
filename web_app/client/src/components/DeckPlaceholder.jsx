import React from 'react';
import Card from './Card.jsx';

export default class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      discarded: []
    }
  }

  componentDidMount() {
    this.setState({cards: this.props.cards})
  }

  render() {
    return (
      <div class="deck--placeholder">
        <h1> #{ props.card.length } </h1>
      </div>
    )
  }
}