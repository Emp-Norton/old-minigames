import React from 'react';
import Card from './Card.jsx';

export default class DeckPlaceholder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []
    }
  }

  componentDidMount() {
    this.setState({cards: this.props.cards})
  }

  render() {
    return (
      <div class="deck--placeholder" onClick={this.props.openModal}>
        <h1> #{ this.state.cards.length } </h1>
      </div>
    )
  }
}