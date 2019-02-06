import React from 'react';

export default const DeckPlaceholder = (props) => {
  return (
    <div class="deck--placeholder">
      <h1> #{ props.card.length } </h1>
    </div>
  )
}