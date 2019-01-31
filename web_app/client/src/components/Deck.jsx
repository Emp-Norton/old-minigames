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
      <div>
        {this.state.cards.map(card => {
          return <Card value={card} />
        })}
      </div>
    )
  }
}