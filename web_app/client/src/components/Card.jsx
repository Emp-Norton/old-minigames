import React from 'react';

const Card = (props) => {
  return (
    <div>
      <h1 class="battlefield--card" onClick={(e) => props.clickHandler(props.player)}> {props.value} </h1>
    </div>
  )
}

export default Card;